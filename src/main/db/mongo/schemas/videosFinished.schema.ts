import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VideoFinishedDocument = HydratedDocument<VideoFinished>;

@Schema({ timestamps: true })
export class VideoFinished {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Video' })
  video: mongoose.Schema.Types.ObjectId;
}

export const VideoFinishedSchema = SchemaFactory.createForClass(VideoFinished);
