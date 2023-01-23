import { Inject, Injectable } from '@nestjs/common';
import { VideosServices } from 'src/main/services/videos.services';
@Injectable()
export class Videos {
  constructor(@Inject('videoServices') private services: VideosServices) {}

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

  createResponse(data: any = {}) {
    const response = {
      status: 'ok',
      payload: data,
    };
    return response;
  }
}
