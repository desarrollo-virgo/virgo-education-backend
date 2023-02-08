import { Inject, Injectable } from '@nestjs/common';
import { isEAN } from 'class-validator';
import { GoogleSheetClient } from 'src/main/external/googleSheet/googleSheetClient';
import { RouteServicesInterface } from '../../courses/domain/courses/interfaces/route.interface';
import { UserServicesInterface } from '../../courses/domain/courses/interfaces/user.interface';

@Injectable()
export class Users {
  constructor(
    @Inject('userServices') private services: UserServicesInterface,
  ) {}

  getAllUser() {
    return this.services.getAllUser();
  }

  async getUser(idUser) {
    const user = await this.services.getUser(idUser);
    const userData = {
      id: user.id,
      nombre: user.name,
      email: user.email,
      directive: user.directive,
      perfil: user.profile,
      inprogress: user.inProgress,
      finished: user.finished,
      scored: user.scored,
    };
    return this.createResponse(userData);
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

  async loadDataFromSheet() {
    await this.services.readSheet();
    return this.createResponse({});
  }

  async addWishList(idUser, idCourse) {
    await this.services.addWishList(idUser, idCourse);
    return this.createResponse({});
  }

  async removeWishList(idUser, idCourse) {
    await this.services.removeWishList(idUser, idCourse);
    return this.createResponse({});
  }

  async generateCertificate(data){
    const res = await this.services.generateCertificate(data)
    return res
  }

  async getProgressInfo(idUser){
    const result = await this.services.getProgressInfo(idUser)
    return result
  }

  createResponse(data) {
    return {
      status: 'ok',
      payload: data,
    };
  }
}
