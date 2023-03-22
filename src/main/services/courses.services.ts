import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { uuid } from 'uuidv4';
import { ConfigService } from '@nestjs/config';
import { courseServicesInterface } from 'src/context/courses/domain/courses/interfaces/courses.interface';
import {
  Course,
  CoursesDocument,
} from 'src/main/db/mongo/schemas/course.schema';
import {
  RouteCourses,
  RouteCoursesDocument,
} from '../db/mongo/schemas/route.schema';
import { Video, VideoDocument } from '../db/mongo/schemas/video.schema';
import { getVideoDurationInSeconds } from 'get-video-duration';
import {
  Directives,
  DirectivesDocument,
} from '../db/mongo/schemas/directive.schema';

import {
  VideoFinished,
  VideoFinishedDocument,
} from '../db/mongo/schemas/videosFinished.schema';
export class CoursesServices implements courseServicesInterface {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CoursesDocument>,
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    @InjectModel(RouteCourses.name)
    private routeModel: Model<RouteCoursesDocument>,
    @InjectModel(Directives.name) private directive: Model<DirectivesDocument>,
    private readonly config: ConfigService,
    @InjectModel(VideoFinished.name)
    private videoFinished: Model<VideoFinishedDocument>,
  ) {}
  async addCourse(data) {
    return await this.courseModel.create(data);
  }

  async getCourses(id) {
    const result = await this.courseModel
      .findById(id)
      .populate('videos')
      .populate('category')
      .populate('route')
      .populate('tags')
      .transform((res) => {
        const responseTransform = res.toJSON();
        responseTransform['id'] = responseTransform['_id'];
        delete responseTransform['_id'];
        responseTransform.category.forEach((cat) => {
          cat['id'] = cat['_id'];
          delete cat['_id'];
          delete cat['__v'];
        });
        responseTransform.videos.forEach((video) => {
          video['id'] = video['_id'];
          delete video['_id'];
          delete video['__v'];
        });
        return responseTransform;
      });
    return result;
  }

  async getCoursesForName(name) {
    return await await this.courseModel.findOne({ name });
  }

  async getAllCourses() {
    const result = await this.courseModel.find();
    return result;
  }

  async videosFromCourse(id) {
    const result = await this.courseModel
      .findById(id, {
        videos: 1,
      })
      .populate('videos');
    return result;
  }

  getCategories: () => any;
  inProgress: () => true;

  addCategory(data) {
    return this.courseModel.create(data);
  }

  addVideo(data) {
    return this.videoModel.create(data);
  }
  async addVideosToCourse(idVideo, idCourse) {
    const course = await this.courseModel.findById(idCourse);
    course.videos = course.videos.concat(idVideo);
    return await course.save();
  }

  async addCategoryToCourse(idCourse, idCategory) {
    const course = await this.getCourses(idCourse);
    course.category = course.category.concat(idCategory);
    return await this.courseModel.findByIdAndUpdate(idCourse, course);
  }

  async addRouteToCourse(idCourse, idRoute) {
    const course = await this.getCourses(idCourse);
    course.route = course.route.concat(idRoute);
    return await this.courseModel.findByIdAndUpdate(idCourse, course);
  }

  async updateCourse(id, data) {
    return await this.courseModel.findByIdAndUpdate(id, { ...data });
  }

  getBlobClient(imageName: string, containerName: string): BlockBlobClient {
    const azureConnection = this.config.get('azureConnection');
    const blobClientService =
      BlobServiceClient.fromConnectionString(azureConnection);
    blobClientService.setProperties({ defaultServiceVersion: '2019-02-02' });
    const containerClient = blobClientService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async uploadCover(file: Express.Multer.File, course) {
    const baseurlStore = this.config.get('base_url_store');
    const containerName = 'images';
    const fileParts = file.originalname.split('.');
    const extension = fileParts[fileParts.length - 1];
    const fileName = `${course}-cover.${extension}`;
    await this.deleteFileStorage(fileName, containerName);
    const blobClient = await this.getBlobClient(fileName, containerName);
    const url = `${baseurlStore}/images/${fileName}`;
    await this.updateCourse(course, { cover: url });
    const blob = await blobClient.uploadData(file.buffer);
    return url;
  }

  async uploadVideo(file: Express.Multer.File, course) {
    const baseurlStore = this.config.get('base_url_store');
    const containerName = 'videos';
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const fileParts = file.originalname.split('.');
    const extension = fileParts[fileParts.length - 1];
    const fileName = `${course}-${uuid()}`;
    const blobClient = this.getBlobClient(
      `${fileName}.${extension}`,
      containerName,
    );
    console.log('blob.....');
    const url = `${baseurlStore}/${containerName}/${fileName}.${extension}`;
    const { num, name } = this.infoToVideo(fileParts);
    const dataVideo = {
      name,
      description: 'sin descripcion',
      num,
      url,
    };
    console.log('subiendo archivo...' + file.originalname);
    console.log('guardando archivo' + file.originalname);
    const resultVideoDB = await this.addVideo(dataVideo);
    console.log('video guardado' + file.originalname);
    const _id = resultVideoDB.id;
    console.log('antes de agregar ...');
    await this.addVideosToCourse(_id, course);
    blobClient.uploadData(file.buffer).then(async () => {
      console.log('video listo ......url: ', url, file.originalname);
      // const duration = await getVideoDurationInSeconds(url);
      this.updateVideoAdditionalAttr(_id, 600);
    });
    console.log('video agregado...' + file.originalname);
    return resultVideoDB;
  }

  async updateVideoAdditionalAttr(id, duration) {
    const video = await this.videoModel.findById(id);
    video.duration = duration;
    video.uploaded = true;
    video.save();
  }
  infoToVideo(fileParts) {
    const nameParts = fileParts[0].split('-');
    const name = nameParts[1] || 'sin nombre';
    const num = nameParts[0] || 0;
    return {
      num,
      name,
    };
  }

  async getCoursesForDirective(idDirectiva) {
    const directive = await this.directive.findById(idDirectiva);
    const courses = await this.courseModel.find();
    const result = courses.map((course) => {
      let exclude = false;
      directive.excludeCourses.forEach((excludeCourse) => {
        if (!excludeCourse) {
          exclude = false;
          return;
        }
        if (excludeCourse.toString() === course['_id'].toString()) {
          exclude = true;
        }
      });
      return {
        id: course._id,
        name: course.name,
        exclude: exclude,
      };
    });
    return result;
  }

  async deleteVideo(idVideo, idCourse) {
    const containerName = 'videos';
    const video = await this.videoModel.findById(idVideo);
    const course = await this.courseModel.findById(idCourse);
    const newListVideos = course.videos.filter((video: any) => {
      return video._id.toString() !== idVideo;
    });
    course.videos = newListVideos;
    course.save();
    video.delete();
    const file = video.url.split('/');
    const nameFile = file[file.length - 1];
    await this.deleteFileStorage(nameFile, containerName);
    return video;
  }

  async deleteFileStorage(name, containerName) {
    try {
      const azureConnection = this.config.get('azureConnection');
      const blobClientService =
        BlobServiceClient.fromConnectionString(azureConnection);
      const containerClient =
        blobClientService.getContainerClient(containerName);
      const containerFile = containerClient.getBlockBlobClient(name);
      await containerFile.delete();
    } catch (error) {
      return true;
    }
  }

  async getFinishedVideoByUser(idCourse, userid) {
    const finishedVideos = await this.videoFinished.find({
      user: userid,
      course: idCourse,
    });
    return finishedVideos;
  }
}
