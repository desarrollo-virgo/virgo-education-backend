import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserServicesInterface } from 'src/context/courses/domain/courses/interfaces/user.interface';
import { Course, CoursesDocument } from '../db/mongo/schemas/course.schema';
import { User, UserDocument } from '../db/mongo/schemas/user.schema';
import {
  VideoFinished,
  VideoFinishedDocument,
} from '../db/mongo/schemas/videosFinished.schema';
import certificate from './certificate';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const html_to_pdf = require('html-pdf-node');
import { Video, VideoDocument } from '../db/mongo/schemas/video.schema';
import { GoogleSheetClient } from '../external/googleSheet/googleSheetClient';
import {
  Directives,
  DirectivesDocument,
} from '../db/mongo/schemas/directive.schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer');

export class UserServices implements UserServicesInterface {
  constructor(
    @InjectModel(User.name)
    private userModule: Model<UserDocument>,
    @InjectModel(Course.name)
    private courseModule: Model<CoursesDocument>,
    @InjectModel(VideoFinished.name)
    private videoFinishedModule: Model<VideoFinishedDocument>,
    @InjectModel(Video.name)
    private videoModule: Model<VideoDocument>,
    @InjectModel(Directives.name)
    private directivesModule: Model<DirectivesDocument>,
    private sheetServiceClient: GoogleSheetClient,
  ) {}
  async getAllUser() {
    return await this.userModule.find({});
  }

  async getUser(idUser) {
    return await this.userModule
      .findOne({ email: idUser })
      .populate({
        path: 'inProgress.course',
        model: 'Course',
      })
      .populate({
        path: 'finished.course',
        model: 'Course',
      });
  }

  async AddUser(data) {
    return await this.userModule.create(data);
  }

  async addInProgressCourse(idUser, idCourse, idVideo, prevIdVIdeo) {
    const user = await this.userModule.findById(idUser).exec();
    const existVideo = this.existVideo(user.inProgress, idVideo);
    if (existVideo) {
      return;
    }
    if (user.inProgress.length == 0) {
      user.inProgress = user.inProgress.concat(idVideo);
    } else {
      const newArrayInProgress = this.deleteInprogress(
        user.inProgress,
        prevIdVIdeo,
      );
      const inProgressVideoUpdate = newArrayInProgress.concat(idVideo);
      user.inProgress = inProgressVideoUpdate;
    }
    return await this.userModule.findByIdAndUpdate(idUser, user);
  }

  async updateTimeProgress(idUser, data: any) {
    const { idVideo, idCourse, progress, finished, num } = data;

    const user = await this.userModule
      .findById(idUser)
      .populate({
        path: 'inProgress.video',
        model: 'Video',
      })
      .populate({
        path: 'inProgress.course',
        model: 'Course',
      });

    if (user.inProgress.length === 0) {
      return this.saveVideoInProgress(user, idCourse, idVideo, 0);
    }

    if (finished) {
      return await this.saveFinishedVideo(idCourse, num, user, data, idVideo);
    }

    return await this.setInProgressTimeVideo(user, idVideo, idCourse, progress);
  }

  async setInProgressTimeVideo(user, idVideo, idCourse, progress) {
    const indexVideo = user.inProgress.findIndex((inprogress) => {
      return (
        inprogress.video.id == idVideo || inprogress.course.id === idCourse
      );
    });

    if (indexVideo >= 0) {
      user.inProgress[indexVideo].progress = progress;
      return user.save();
    }

    return this.saveVideoInProgress(user, idCourse, idVideo, progress);
  }

  async saveFinishedVideo(idCourse, num, user, data, idVideo) {
    // agregar videos a la tabla de videos finalizados
    await this.addVideoFinishedToModel(idCourse, num, user, data, idVideo);

    // agregar el siguiente video a inprogress

    const date = new Date();
    const course = await this.courseModule
      .findById(idCourse)
      .populate({ path: 'videos', match: { num: num + 1 } });

    if (course.videos.length > 0) {
      const dataProgress = {
        course: idCourse,
        video: course.videos[0]['_id'],
        progress: 0,
        date,
        num: course.videos[0].num,
      };
      const indVideo = user.inProgress.findIndex((inp) => {
        return inp.course.id == idCourse;
      });
      user.inProgress[indVideo] = dataProgress;
    } else {
      const inProgressNew = user.inProgress.filter((inpro) => {
        return inpro.video.id !== idVideo;
      });
      user.inProgress = inProgressNew.length === 0 ? undefined : inProgressNew;
    }
    return user.save();
  }

  async addVideoFinishedToModel(idCourse, num, user, data, idVideo) {
    const courseToFinish = await this.courseModule.findById(idCourse);
    const videosFromCourse = courseToFinish.videos.length;

    const videoFinishedExist = await this.videoFinishedModule.find({
      video: idVideo,
      user: user._id,
    });

    if (videoFinishedExist.length === 0) {
      await this.videoFinishedModule.create({
        user: user._id,
        video: idVideo,
        course: idCourse,
      });
    }
    const videoCourseFinished = await this.videoFinishedModule.find({
      course: idCourse,
      user: user._id,
    });

    if (videoCourseFinished.length === videosFromCourse) {
      await this.addFinishedCourse(user.id, data);
    }
  }

  saveVideoInProgress(user, idCourse, idVideo, progress) {
    const date = new Date();
    const dataProgress = {
      course: idCourse,
      video: idVideo,
      progress,
      date,
      num: 1,
    };
    user.inProgress = user.inProgress.concat(dataProgress);
    return user.save();
  }
  existVideo(inProgress: Video[], current) {
    return inProgress.includes(current);
  }
  deleteInprogress(inProgress: Video[], current): Video[] {
    return inProgress.filter((video) => {
      return video != current;
    });
  }

  async addFinishedCourse(idUser, courseData) {
    const { idVideo, idCourse } = courseData;
    const user = await this.userModule.findById(idUser);
    const result = JSON.stringify(user);
    const resultJSON = JSON.parse(result);
    const courseExist = resultJSON.finished.some((fin) => {
      return fin.course === idCourse;
    });
    if (courseExist) {
      return;
    }
    user.finished = user.finished.concat({
      course: idCourse,
      date: new Date(),
    });
    // const newArrayInProgress = this.deleteInprogress(user.inProgress, idVideo);
    // user.inProgress = newArrayInProgress;
    // const existCourse = await this.courseModule.findById(idCourse);
    // if (!existCourse) {
    //   user.finished = user.finished.concat({
    //     course: idCourse,
    //     date: new Date(),
    //   });
    // }
    return await user.save();
  }

  async getFinishedCourses(idUser) {
    return await this.userModule
      .findById(idUser, {
        finished: 1,
      })
      .populate({
        path: 'finished.course',
        model: 'Course',
      });
  }

  async readSheet() {
    const result = await this.sheetServiceClient.getInfo();
    const infoInstitucion = result[0];
    const institucionData = {
      sostenedor: {
        name: infoInstitucion.sostenedor.trim().toLowerCase(),
      },
      city: infoInstitucion.comuna.trim().toLowerCase(),
      pais: infoInstitucion.pais.trim().toLowerCase(),
      name: infoInstitucion.institucion.trim().toLowerCase(),
    };
    const resultDirective = await this.directivesModule.find({
      name: institucionData.sostenedor.name,
    });
    if (resultDirective.length === 0) {
      await this.directivesModule.create(institucionData);
    }
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      const userData = {
        name: element.nombre.trim().toLowerCase(),
        email: element.correo.trim().toLowerCase(),
        profile: element.perfil.trim().toLowerCase(),
        directive: institucionData.sostenedor.name,
        rut: element.rut.trim().toLowerCase(),
      };
      await this.saveUser(userData);
    }
    return result;
  }

  async addWishList(idUser, idCourse) {
    const result = await this.userModule.findById(idUser);
    result.wishList.push(idCourse);
    return await result.save();
  }

  async removeWishList(idUser, idCourse) {
    const result = await this.userModule.findById(idUser);
    result.wishList.push(idCourse);
    const newList = result.wishList.filter((list) => {
      return list != idCourse;
    });
    if (newList.length === 0) {
      result.wishList = undefined;
    } else {
      result.wishList = newList;
    }
    return await result.save();
  }
  async saveUser(user) {
    return await this.userModule.create(user);
  }

  async generateCertificate(data) {
    let certificate_template = certificate.replace(
      '[%COURSE%]',
      data.courseName.toUpperCase(),
    );
    certificate_template = certificate_template.replace(
      '[%NAME%]',
      data.userName.toUpperCase(),
    );
    certificate_template = certificate_template.replace(
      '[%PROFESSOR%]',
      data.userName.toUpperCase(),
    );
    certificate_template = certificate_template.replace(
      '[%DATE%]',
      data.courseDate.split('T')[0],
    );
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(certificate_template, {
      waitUntil: 'networkidle0',
    });
    const pdf = await page.pdf({ format: 'A0', landscape: true });
    await browser.close();
    return pdf.toString('base64');
  }

  getRanking(stars) {
    const ranking = {
      Bronze: [0, 10],
      Silver: [11, 19],
      Gold: [20, 9999999],
    };

    const ranks = Object.keys(ranking);
    for (let i = 0; i < ranks.length; i++) {
      const rank = ranking[ranks[i]];
      if (stars >= rank[0] && stars <= rank[1]) return ranks[i];
    }
  }

  async getProgressInfo(idUser) {
    const userProgress = {
      stars: 0,
      studyHours: 0,
      completedRoutes: 0,
      rank: '',
      completedCourses: 0
    };

    const userInfo = await this.userModule.findById(idUser);
    const finishedCourses = userInfo['finished'];
    const coursesId = [];
    finishedCourses.map((value, index) => {
      coursesId.push(value['course']);
    });

    userProgress['completedCourses'] = coursesId.length
    userProgress['stars'] = coursesId.length;
    userProgress['rank'] = this.getRanking(userProgress['stars']);

    const coursesInfo = await this.courseModule.find({ id: coursesId });
    const videosId = [];
    const routesId = [];
    coursesInfo.map((value, index) => {
      coursesId.concat(value['videos']);
      routesId.concat(value['route']);
    });
    userProgress['completedRoutes'] = [...new Set(routesId)].length;

    const videosInfo = await this.videoModule.find({ id: videosId });
    videosInfo.map((value, index) => {
      userProgress['studyHours'] += (value['duration'] || 0) / 3600;
    });

    return userProgress;
  }
}
