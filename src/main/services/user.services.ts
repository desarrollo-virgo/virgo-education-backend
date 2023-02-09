import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserServicesInterface } from 'src/context/courses/domain/courses/interfaces/user.interface';
import { Course, CoursesDocument } from '../db/mongo/schemas/course.schema';
import { User, UserDocument } from '../db/mongo/schemas/user.schema';
import { Video } from '../db/mongo/schemas/video.schema';
import {
  VideoFinished,
  VideoFinishedDocument,
} from '../db/mongo/schemas/videosFinished.schema';
import { GoogleSheetClient } from '../external/googleSheet/googleSheetClient';
import certificate from './certificate';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const html_to_pdf = require('html-pdf-node');

export class UserServices implements UserServicesInterface {
  constructor(
    @InjectModel(User.name)
    private userModule: Model<UserDocument>,
    @InjectModel(Course.name)
    private courseModule: Model<CoursesDocument>,
    @InjectModel(VideoFinished.name)
    private videoFinishedModule: Model<VideoFinishedDocument>,
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
      // user.inProgress.push(dataProgress);
    } else {
      user.inProgress = undefined;
      await this.addFinishedCourse(user.id, data);
    }
    return user.save();
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
    const user = await this.userModule.findById(idUser).exec();
    const newArrayInProgress = this.deleteInprogress(user.inProgress, idVideo);
    user.inProgress = newArrayInProgress;
    const existCourse = await this.courseModule.findById(idCourse);
    if (!existCourse) {
      user.finished = user.finished.concat({
        course: idCourse,
        date: new Date(),
      });
    }
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
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      const userData = {
        name: element.nombre.trim().toLowerCase(),
        email: element.correo.trim().toLowerCase(),
        profile: element.perfil.trim().toLowerCase(),
        directive: element.institucion.trim().toLowerCase(),
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
    const options = { format: 'A4' };
    const file = { content: certificate_template };
    const buffer = await html_to_pdf.generatePdf(file, options);
    return buffer.toString('base64');
  }
}
