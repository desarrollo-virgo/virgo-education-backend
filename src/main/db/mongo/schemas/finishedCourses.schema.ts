import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { Course } from './course.schema';

export type FinishedCourseDocument = HydratedDocument<FinishedCourses>;

@Schema({ timestamps: true })
export class FinishedCourses {
  @Prop()
  course: Course;

  @Prop()
  date: any;
}

export const FinishedCoursesSchema =
  SchemaFactory.createForClass(FinishedCourses);
