import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Videos } from 'src/context/videos/application/videos';

@Controller('videos')
export class VideosController {
  constructor(private videos: Videos) {}

  @Post('/:id')
  getCourses(@Param() data: any, @Body() bodyData) {
    const { id } = data;
    return this.videos.updateVideo(id, bodyData);
  }

  @Post('/:idVideo/score')
  async addScore(@Param() data: any, @Body() body, @Headers() headers) {
    const { idVideo } = data;
    const { userid } = headers;
    const { score } = body;
    try {
      return await this.videos.averageScore(idVideo, userid, score);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
