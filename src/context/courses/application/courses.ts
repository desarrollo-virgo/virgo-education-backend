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

  createResponse(data: any) {
    const response = {
      status: 'ok',
      payload: data,
    };
    return response;
  }
}
