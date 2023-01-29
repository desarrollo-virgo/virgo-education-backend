import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RouteServicesInterface } from 'src/context/courses/domain/courses/interfaces/route.interface';

import {
  RouteCourses,
  RouteCoursesDocument,
} from 'src/main/db/mongo/schemas/route.schema';

export class RouteServices implements RouteServicesInterface {
  constructor(
    @InjectModel(RouteCourses.name)
    private routeModule: Model<RouteCoursesDocument>,
  ) {}

  addRoute(data: any) {
    return this.routeModule.create(data);
  }

  getRoutes() {
    return this.routeModule.find({});
  }

  getAllRoutes() {
    return this.routeModule.find({}).populate({
      path: 'courses.course',
      model: 'Course',
    });
  }

  async addCourseToRoute(idRoute, body) {
    const route = await this.routeModule.findById(idRoute);
    route.courses = body;
    route.save();
  }
}
