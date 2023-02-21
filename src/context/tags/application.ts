import { Inject, Injectable } from '@nestjs/common';
import { TagServicesInterfaces } from './domain/tagServices.interface';
@Injectable()
export class Tags {
  constructor(@Inject('tagServices') private services: TagServicesInterfaces) {}

  async getTags() {
    const result = await this.services.getTags();
    return this.createResponse(result);
  }

  createResponse(data: any) {
    const response = {
      status: 'ok',
      payload: data,
    };
    return response;
  }
}
