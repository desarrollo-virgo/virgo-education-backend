import { Inject, Injectable } from '@nestjs/common';
import {
  courseServicesInterface,
  InprogressCoursesInterfaces,
} from '../domain/courses/interfaces/courses.interface';

@Injectable()
export class Courses {
  constructor(
    @Inject('courseServices') private services: courseServicesInterface,
  ) {}

  InprogressCourses(data: InprogressCoursesInterfaces) {
    return this.services.inProgress();
  }

  getAllCoursesForRoutes() {
    return true;
  }

  getCategories() {
    return this.services.getCategories();
  }

  getAllCoursesForCategory() {
    return true;
  }

  async videosFromCourse(id) {
    const videos = await this.services.videosFromCourse(id);
    const buildPayload = this.buildPayloadVideos(videos);
    return this.createResponse(buildPayload);
  }

  setInprogressCourse() {
    return true;
  }

  addCategory(data) {
    return this.services.addCategory(data);
  }

  async addCourse(data) {
    const result = JSON.stringify(await this.services.addCourse(data));
    const resultJSON = JSON.parse(result);
    resultJSON['id'] = resultJSON['_id'];
    delete resultJSON['_id'];
    delete resultJSON['__v'];
    return this.createResponse(resultJSON);
  }

  async getCourses(id) {
    const coursesData = await this.services.getCourses(id);
    // coursesData.category.forEach((category) => {
    //   category.id = category._id.toString();
    // });
    const buildPayload = this.buildPayloadVideos(coursesData);
    coursesData.videos = buildPayload;
    return this.createResponse(coursesData);
  }

  async getAllCourses() {
    const coursesData = await this.services.getAllCourses();
    const buildPayload = this.buildPayload(coursesData);
    return this.createResponse(buildPayload);
  }

  async addVideo(data, idCourse) {
    data.course = idCourse;
    const { _id } = await this.services.addVideo(data);
    return this.addVideosToCourse(_id, idCourse);
  }

  addVideosToCourse(idVideo, idCourse) {
    return this.services.addVideosToCourse(idVideo, idCourse);
  }

  addCategoryToCourse(idCourse, idCategory) {
    return this.services.addCategoryToCourse(idCourse, idCategory);
  }

  addRouteToCourse(idCourse, idRoute) {
    return this.services.addRouteToCourse(idCourse, idRoute);
  }

  async updateCourse(id, data) {
    let dataToUpdate: any = {};
    if (data?.name) {
      dataToUpdate = {
        name: data.name,
      };
    }
    if (data?.description) {
      dataToUpdate = {
        description: data.description,
      };
    }
    if (data?.tags) {
      dataToUpdate = {
        tags: data.tags,
      };
    }

    if (data?.routes) {
      dataToUpdate = {
        route: data.routes,
      };
    }

    if (data?.category) {
      dataToUpdate = {
        category: data.category,
      };
    }

    if (data?.expert) {
      dataToUpdate = {
        expert: data.expert,
      };
    }

    await this.services.updateCourse(id, dataToUpdate);
    return this.createResponse({});
  }
  createResponse(data: any) {
    const response = {
      status: 'ok',
      payload: data,
    };
    return response;
  }

  buildPayload(data: any[]) {
    const courses = data.map((course) => {
      const courseInfo = {
        id: course._id,
        name: course.name,
        description: course.description,
        tags: course.tags,
        score: course.score,
        guid: course.guid,
        category: course.category,
        route: course.route,
      };
      return courseInfo;
    });
    return courses;
  }

  buildPayloadVideos(data) {
    const videosInfo = data.videos.map((video) => {
      return {
        id: video.id,
        name: video.name,
        duration: video.duration,
        description: video.description || 'sin descripcion',
        thumbnail: '',
        guid: video.guid,
        position: video.num,
        score: video.score,
        urlEmbed: video.url,
        files: video.files,
      };
    });
    return videosInfo;
  }

  createThumbnail(video) {
    const url = 'https://vz-49107a3c-cdb.b-cdn.net';
    return `${url}/${video.guid}/${video.thumbnail}`;
  }

  createUrlVideoEmbed(video) {
    const streamManagerID = 80619;
    const url = 'https://iframe.mediadelivery.net/embed';
    return `${url}/${streamManagerID}/${video.guid}`;
  }

  async uploadCover(file: Express.Multer.File, course: string) {
    const url = await this.services.uploadCover(file, course);
    return this.createResponse({ url: url });
  }

  async uploadVideo(file: Express.Multer.File, course: string) {
    const result = await this.services.uploadVideo(file, course);
    const payload = {
      id: result.id,
      name: result.name,
      description: result.description,
      url: result.url,
      position: result.num,
    };
    return this.createResponse(payload);
  }

  async getCoursesForDirective(idDirectiva) {
    const response = await this.services.getCoursesForDirective(idDirectiva);
    return this.createResponse(response);
  }

  async deleteVideo(idVideo, idCourse) {
    const response = await this.services.deleteVideo(idVideo, idCourse);
    return this.createResponse(response);
  }

  async getFinishedVideoByUser(idCourse, userid) {
    const response = await this.services.getFinishedVideoByUser(
      idCourse,
      userid,
    );
    return this.createResponse(response);
  }
}
