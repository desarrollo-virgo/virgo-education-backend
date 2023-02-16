import { Inject, Injectable } from '@nestjs/common';
import { DirectivesServicesInterface } from '../domain/directive/interfaces/directives.interface';

@Injectable()
export class Directive {
  constructor(
    @Inject('directiveServices') private services: DirectivesServicesInterface,
  ) {}

  getDirectives() {
    return this.services.getDirectives();
  }

  async getDirective(idDirective) {
    const result = await this.services.getDirective(idDirective);
    return this.createResponse(result);
  }

  async addDirective(data) {
    const result = await this.services.addDirective(data);
    return this.createResponse(result);
  }

  async excludeCourse(directive, course) {
    const result = await this.services.excludeCourse(directive, course);
    return this.createResponse(result);
  }

  async includeCourse(directive, course) {
    const result = await this.services.includeCourse(directive, course);
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
