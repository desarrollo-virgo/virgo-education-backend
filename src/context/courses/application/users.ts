import { Inject, Injectable } from '@nestjs/common';
import { RouteServicesInterface } from '../domain/courses/interfaces/route.interface';
import { UserServicesInterface } from '../domain/courses/interfaces/user.interface';

@Injectable()
export class Users {
  constructor(
    @Inject('userServices') private services: UserServicesInterface,
  ) {}

  getAllUser() {
    return this.services.getAllUser();
  }

  getUser(idUser) {
    return this.services.getUser(idUser);
  }

  addUser(data) {
    return this.services.AddUser(data);
  }

  addInProgressCourse(idUser, idCourse, idVideo, prevIdVIdeo) {
    return this.services.addInProgressCourse(
      idUser,
      idCourse,
      idVideo,
      prevIdVIdeo,
    );
  }

  addFinishedCourse(idUser, courseData) {
    return this.services.addFinishedCourse(idUser, courseData);
  }

  getFinishedCourses(idUser) {
    return this.services.getFinishedCourses(idUser);
  }

  async updateTimeProgress(idUser, courseData) {
    const response = await this.services.updateTimeProgress(idUser, courseData);
    return this.createResponse(response);
  }

  createResponse(data) {
    return {
      status: 'ok',
      data: data,
    };
  }
}
