import { Inject, Injectable } from '@nestjs/common';
import {
  courseServicesInterface,
  InprogressCoursesInterfaces,
} from '../domain/courses/interfaces/courses.interface';
import { UseCaseCourses } from '../domain/courses/useCases/courses';

@Injectable()
export class Courses {
  constructor(
    @Inject('courseServices') private services: courseServicesInterface,
    private useCaseCourses: UseCaseCourses,
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
    const buildPayload = this.useCaseCourses.buildPayloadVideos(videos);
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
    const buildPayload = this.useCaseCourses.buildPayloadVideos(coursesData);
    coursesData.videos = buildPayload;
    return this.createResponse(coursesData);
  }

  async getAllCourses() {
    const coursesData = await this.services.getAllCourses();
    const buildPayload = this.useCaseCourses.buildPayload(coursesData);
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
}
