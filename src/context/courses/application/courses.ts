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

  addCourse(data) {
    return this.services.addCourse(data);
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
    console.log(_id);
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
        thumbnail: this.createThumbnail(video),
        guid: video.guid,
        position: video.num,
        urlEmbed: this.createUrlVideoEmbed(video),
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
}
