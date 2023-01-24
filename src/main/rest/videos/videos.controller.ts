import {
  Body,
  Controller,
  Get,
  Headers,
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
  addScore(@Param() data: any, @Body() body, @Headers() headers) {
    const { idVideo } = data;
    const { userid } = headers;
    const { score } = body;
    return this.videos.averageScore(idVideo, userid, score);
  }
}
