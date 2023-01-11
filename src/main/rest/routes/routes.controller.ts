import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RoutesCourses } from 'src/context/courses/application/routes';

@Controller('route')
export class RoutesController {
  constructor(private routesCourse: RoutesCourses) {}

  @Get('/route/directive/:idDirective')
  RouteCourses(@Param() data) {
    const { idDirective } = data;
    return this.routesCourse.getRoutes(idDirective);
  }

  @Get('/')
  RouteAllCourses() {
    return this.routesCourse.getRoutes(null);
  }

  @Post('/')
  addRoutes(@Body() data) {
    return this.routesCourse.addRoute(data);
  }
}
