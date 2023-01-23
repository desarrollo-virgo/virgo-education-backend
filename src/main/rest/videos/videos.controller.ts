import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Videos } from 'src/context/videos/application/videos';

@Controller('videos')
export class VideosController {
  constructor(private courses: Videos) {}

  @Post('/:id')
  getCourses(@Param() data: any, @Body() bodyData) {
    const { id } = data;
    return this.courses.updateVideo(id, bodyData);
  }
}
