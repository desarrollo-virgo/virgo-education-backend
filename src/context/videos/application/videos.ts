import { Inject, Injectable } from '@nestjs/common';
import { VideoServiceInterface } from './videosServiceIterface';
@Injectable()
export class Videos {
  constructor(
    @Inject('videoServices') private services: VideoServiceInterface,
  ) {}

  async updateVideo(id, data) {
    let dataToUpdate = {};
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
    await this.services.updateVideo(id, dataToUpdate);
    return this.createResponse();
  }

  async averageScore(idVideo, idUser, score) {
    const response = await this.services.averageScore(idVideo, idUser, score);
    return this.createResponse(response);
  }

  createResponse(data: any = {}) {
    const response = {
      status: 'ok',
      payload: data,
    };
    return response;
  }
}
