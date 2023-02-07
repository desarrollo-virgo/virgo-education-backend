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
        courses: this.getCourses(result.courses),
      };
    });
    return this.createResponse(routes);
  }

  getCourses(courses) {
    return courses.map(({ course, position }) => {
      if (!course) {
        return {};
      }
      return {
        id: course._id,
        name: course.name,
        position: position,
        cover: course.cover,
        description: course.description,
        tags: course.tags,
      };
    });
  }
  addRoute(data) {
    return this.services.addRoute(data);
  }

  async addCourseToRoute(idRoute, body) {
    const results = await this.services.addCourseToRoute(idRoute, body);
    return results;
  }

  createResponse(data: any) {
    const response = {
      status: 'ok',
      payload: data,
    };
    return response;
  }
}
