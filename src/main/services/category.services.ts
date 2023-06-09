import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { categoriesServicesInterface } from 'src/context/courses/domain/courses/interfaces/categories.interface';
import {
  Category,
  CategoryDocument,
} from 'src/main/db/mongo/schemas/category.schema';
import { Course, CoursesDocument } from '../db/mongo/schemas/course.schema';

export class CategoryServices implements categoriesServicesInterface {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Course.name) private courseModel: Model<CoursesDocument>,
  ) {}

  addCategory(data) {
    return this.categoryModel.create(data);
  }

  getCategories(idDirective) {
    return this.categoryModel.find({});
  }

  getAllCategories() {
    return this.categoryModel.find({});
  }

  getCourseCategories(idcategory) {
    return this.courseModel.find({ category: idcategory });
  }
}
