import { Inject, Injectable } from '@nestjs/common';
import { RouteServicesInterface } from '../domain/courses/interfaces/route.interface';

@Injectable()
export class RoutesCourses {
  constructor(
    @Inject('routeServices') private services: RouteServicesInterface,
  ) {}

  getRoutes(idDirective) {
    return this.services.getRoutes(idDirective);
  }

  addRoute(data) {
    return this.services.addRoute(data);
  }
}
