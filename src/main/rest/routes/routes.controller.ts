import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RoutesCourses } from 'src/context/paths/application/routes';

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
    return this.routesCourse.getAllRoutes();
  }

  @Post('/')
  addRoutes(@Body() data) {
    return this.routesCourse.addRoute(data);
  }

  @Post('/:idRoute')
  addCourseToRoute(@Param() params, @Body() body) {
    const { idRoute } = params;
    return this.routesCourse.addCourseToRoute(idRoute, body);
  }
}
