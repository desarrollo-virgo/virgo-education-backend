import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Courses } from 'src/context/courses/application/courses';
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
    return this.courses.getAllCourses();
  }

  @Get('/:idCourse')
  infoCourse(@Param() data: any) {
    const { idCourse } = data;
    return this.courses.getCourses(idCourse);
  }

  @Get('/:idCourse/videos')
  videos(@Param() data: any) {
    const { idCourse } = data;
    return this.courses.videosFromCourse(idCourse);
  }

  @Post('/')
  addCourse(@Body() data: any) {
    return this.courses.addCourse(data);
  }

  @Put('/:idCourse')
  updateCourse(@Body() data: any, @Param('idCourse') id: string) {
    try {
      return this.courses.updateCourse(id, data);
    } catch (error) {
      console.log(error);
    }
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
  @Post('/:idCourse/uploadCover')
  @UseInterceptors(FileInterceptor('cover'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param() data: any,
  ): Promise<any> {
    const { idCourse } = data;
    return await this.courses.uploadCover(file, idCourse);
  }

  @Post('/:idCourse/uploadVideo')
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Param() data: any,
  ) {
    try {
      const { idCourse } = data;
      return await this.courses.uploadVideo(file, idCourse);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/directive/:idDirectiva')
  async getCoursesForDirective(@Param() params) {
    const { idDirectiva } = params;
    try {
      return await this.courses.getCoursesForDirective(idDirectiva);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:idCourse/video/:idVideo')
  async deleteVideo(@Param() params) {
    const { idVideo, idCourse } = params;
    try {
      return await this.courses.deleteVideo(idVideo, idCourse);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
