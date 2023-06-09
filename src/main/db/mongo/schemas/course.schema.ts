import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Category } from './category.schema';
import { RouteCourses } from './route.schema';
import { Tag } from './tags.schema';
import { Video } from './video.schema';

export type CoursesDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Tag' })
  tags: Tag[];

  @Prop()
  score: number;

  @Prop()
  guid: string;

  @Prop({ default: false })
  public: boolean;

  @Prop()
  cover: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Category' })
  category: Category[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'RouteCourses' })
  route: RouteCourses[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Video' })
  videos: Video[];

  @Prop()
  expert: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
