import { Inject, Injectable } from '@nestjs/common';
import { RouteServicesInterface } from '../../courses/domain/courses/interfaces/route.interface';

@Injectable()
export class RoutesCourses {
  constructor(
    @Inject('routeServices') private services: RouteServicesInterface,
  ) {}

  getRoutes(idDirective) {
    return this.services.getRoutes(idDirective);
  }

  async getAllRoutes() {
    const results = await this.services.getAllRoutes();
    const routes = results.map((result) => {
      return {
        id: result.id,
        name: result.name,
      };
    });
    return this.createResponse(routes);
  }
  addRoute(data) {
    return this.services.addRoute(data);
  }

  createResponse(data: any) {
    const response = {
      status: 'ok',
      payload: data,
    };
    return response;
  }
}
