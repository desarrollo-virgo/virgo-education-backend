import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from './course.schema';

export type VideoDocument = HydratedDocument<Video>;

@Schema()
export class Video {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  url: string;

  @Prop()
  num: number;

  @Prop()
  duration: number;

  @Prop()
  thumbnail: string;

  @Prop()
  guid: string;

  @Prop({
    default: {
      averageScore: 0,
      numScore: 0,
    },
    type: {
      averageScore: Number,
      numScore: Number,
    },
  })
  score: {
    averageScore: number;
    numScore: number;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: mongoose.Schema.Types.ObjectId;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
