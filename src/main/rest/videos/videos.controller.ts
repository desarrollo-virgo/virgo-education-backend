import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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

  @Post('/:idVideo/questions')
  async addQuestions(@Param() params: any, @Body() body) {
    const { idVideo } = params;
    try {
      return await this.videos.addQuestions(idVideo, body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:idVideo/questions')
  async getQuestions(@Param() params: any, @Body() body, @Query() query) {
    const { idVideo } = params;
    const { verify } = query;
    try {
      return await this.videos.getQuestions(idVideo, body, verify);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:idVideo/questions/verify')
  async verifyQuestion(@Param() params, @Body() body) {
    const { idVideo } = params;
    try {
      return await this.videos.verifyQuestion(idVideo, body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:idVideo/uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Param() data: any,
  ) {
    const { idVideo } = data;
    return await this.videos.uploadFile(file, idVideo);
  }

  @Get('/:idVideo/files')
  async getFiles(@Param() params) {
    const { idVideo } = params;
    try {
      return await this.videos.getFiles(idVideo);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:idVideo/file/:idFile')
  async deleteFile(@Param() params) {
    const { idVideo, idFile } = params;
    try {
      return await this.videos.deleteFile(idVideo, idFile);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
