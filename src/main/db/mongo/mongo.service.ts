import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CoursesDocument } from './schemas/course.schema';
import { StoreServiceI } from 'src/context/courses/domain/db/db.service.interface';

@Injectable()
export class MongoService implements StoreServiceI {
  constructor(
    @InjectModel(Course.name) private personModel: Model<CoursesDocument>,
  ) {}
  getById: () => '';
  update: (data: any, id: any) => '';

  async save(createCatDto: any): Promise<Course> {
    console.log(createCatDto);
    const createdCat = new this.personModel(createCatDto);
    return createdCat.save();
  }

  async getAll(): Promise<Course[]> {
    return this.personModel.find().exec();
  }
}
