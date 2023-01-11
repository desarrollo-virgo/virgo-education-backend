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

  setInprogressCourse() {
    return true;
  }

  addCategory(data) {
    return this.services.addCategory(data);
  }

  addCourse(data) {
    return this.services.addCourse(data);
  }

  getCourses(id) {
    return this.services.getCourses(id);
  }

  getAllCourses() {
    return this.services.getAllCourses();
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
}
