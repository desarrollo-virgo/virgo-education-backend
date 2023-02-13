import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Users } from 'src/context/user/application/users';

@Controller('user')
export class UserController {
  constructor(private user: Users) {}

  @Get('/load/fromFile')
  loadUsersFromFile() {
    return this.user.loadDataFromSheet();
  }

  @Get('/:idUser')
  getUser(@Param() data) {
    const { idUser } = data;
    return this.user.getUser(idUser);
  }

  @Get('/')
  getAllUsers() {
    return this.user.getAllUser();
  }

  @Post('/')
  addUser(@Body() data) {
    return this.user.addUser(data);
  }

  // @Post('/:idUser/course/inProgress')
  // addInProgressCourse(@Body() BodyData, @Param() param) {
  //   const { idUser } = param;
  //   const { idVideo, idCourse, prevIdVIdeo } = BodyData;
  //   return this.user.addInProgressCourse(
  //     idUser,
  //     idCourse,
  //     idVideo,
  //     prevIdVIdeo,
  //   );
  // }

  @Post('/:idUser/course/inProgress')
  async addInProgressCourse(@Body() BodyData, @Param() param) {
    const { idUser } = param;
    try {
      return await this.user.updateTimeProgress(idUser, BodyData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:idUser/course/finished')
  addFinishedCourse(@Body() BodyData, @Param() param) {
    const { idUser } = param;
    return this.user.addFinishedCourse(idUser, BodyData);
  }

  @Get('/:idUser/course/finished')
  getFinishedCourse(@Param() param) {
    const { idUser } = param;
    return this.user.getFinishedCourses(idUser);
  }

  @Post('/:idUser/course/wishlist')
  addWishList(@Body() BodyData, @Param() param) {
    const { idUser } = param;
    const { idCourse } = BodyData;
    return this.user.addWishList(idUser, idCourse);
  }

  @Delete('/:idUser/course/wishlist')
  removeWishList(@Body() BodyData, @Param() param) {
    const { idUser } = param;
    const { idCourse } = BodyData;
    return this.user.removeWishList(idUser, idCourse);
  }

  @Post('courseCertificate')
  generateCertificate(@Body() data){
    return this.user.generateCertificate(data)
  }

  @Get('/:idUser/progressInfo')
  getProgressInfo(@Param() param){
    const { idUser } = param;
    return this.user.getProgressInfo(idUser)
  }

  @Get('/info/professors')
  getInfoProfessors(){
    return this.user.getInfoProfessors()
  }
}
