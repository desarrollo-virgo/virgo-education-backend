import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Courses } from 'src/context/courses/application/courses';
import { RoutesCourses } from 'src/context/courses/application/routes';
import { CategoryServices } from 'src/main/services/category.services';
import { RouteServices } from 'src/main/services/route.services';
import {
  CategoryForCoursesDTO,
  InprogressCoursesDTO,
  RecommendedCoursesDTO,
  SetInProgressCourseDTO,
} from './courses.dto';

@Controller('courses')
export class CoursesController {
  constructor(private courses: Courses) {}

  @Get('/')
  getCourses(@Query() data: any) {
    const { id } = data;
    if (id) {
      return this.courses.getCourses(id);
    }
    return this.courses.getAllCourses();
  }

  @Post('/')
  addCourse(@Body() data: any) {
    return this.courses.addCourse(data);
  }

  @Get('/inprogress')
  inProgressCourses(@Query() data: InprogressCoursesDTO) {
    return this.courses.InprogressCourses(data);
  }

  @Get('/recommended')
  RecommendatedCourses(@Query() data: RecommendedCoursesDTO) {
    return data;
  }

  @Get('/category/courses')
  CategoryForCourses(@Query() data: CategoryForCoursesDTO) {
    return data;
  }

  @Post('/inprogress')
  SetInProgressCourses(@Body() data: SetInProgressCourseDTO) {
    return data;
  }

  @Post('/:idCourse/category/:idCategory')
  addCategoryToCourse(@Param() data: any) {
    const { idCourse, idCategory } = data;
    return this.courses.addCategoryToCourse(idCourse, idCategory);
  }

  @Post('/:idCourse/route/:idRoute')
  addRouteToCourse(@Param() data: any) {
    const { idCourse, idRoute } = data;
    return this.courses.addRouteToCourse(idCourse, idRoute);
  }

  @Post('/:idCourse/video')
  addVideo(@Body() data, @Param() courseData) {
    const { idCourse } = courseData;
    return this.courses.addVideo(data, idCourse);
  }
}
