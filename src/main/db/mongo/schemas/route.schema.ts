import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from './course.schema';

export type RouteCoursesDocument = HydratedDocument<RouteCourses>;

@Schema()
export class RouteCourses {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: [
      {
        course: mongoose.Schema.Types.ObjectId,
        position: Number,
      },
    ],
    ref: 'Course',
  })
  courses: any[];
}

export const RouteCoursesSchema = SchemaFactory.createForClass(RouteCourses);
