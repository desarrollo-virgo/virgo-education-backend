import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { courseServicesInterface } from 'src/context/courses/domain/courses/interfaces/courses.interface';
import {
  Course,
  CoursesDocument,
} from 'src/main/db/mongo/schemas/course.schema';
import {
  RouteCourses,
  RouteCoursesDocument,
} from '../db/mongo/schemas/route.schema';
import { Video, VideoDocument } from '../db/mongo/schemas/video.schema';

export class CoursesServices implements courseServicesInterface {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CoursesDocument>,
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    @InjectModel(RouteCourses.name)
    private routeModel: Model<RouteCoursesDocument>,
  ) {}
  addCourse(data) {
    return this.courseModel.create(data);
  }

  async getCourses(id) {
    const result = await this.courseModel
      .findById(id)
      .populate('videos')
      .populate('category')
      .populate('route');
    return result;
  }

  async getCoursesForName(name) {
    return await await this.courseModel.findOne({ name });
  }

  async getAllCourses() {
    const result = await this.courseModel.find({}).populate('videos');
    return result;
  }

  getCategories: () => any;
  inProgress: () => true;

  addCategory(data) {
    return this.courseModel.create(data);
  }

  addVideo(data) {
    return this.videoModel.create(data);
  }

  async addVideosToCourse(idVideo, idCourse) {
    const course = await this.getCourses(idCourse);
    course.videos = course.videos.concat(idVideo);
    return await this.courseModel.findByIdAndUpdate(idCourse, course);
  }

  async addCategoryToCourse(idCourse, idCategory) {
    const course = await this.getCourses(idCourse);
    course.category = course.category.concat(idCategory);
    return await this.courseModel.findByIdAndUpdate(idCourse, course);
  }

  async addRouteToCourse(idCourse, idRoute) {
    const course = await this.getCourses(idCourse);
    course.route = course.route.concat(idRoute);
    return await this.courseModel.findByIdAndUpdate(idCourse, course);
  }
}
