import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from './course.schema';
import { Directives } from './directive.schema';
import { FinishedCourses } from './finishedCourses.schema';
import { Profile } from './profile.schema';
import { Video } from './video.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ type: String, ref: 'Directives' })
  directive: string;

  @Prop()
  profile: string;

  @Prop({
    type: [
      {
        course: mongoose.Schema.Types.ObjectId,
        video: mongoose.Schema.Types.ObjectId,
        date: Date,
        progress: Number,
        num: Number,
      },
    ],
    ref: 'inProgress',
    unique: false,
  })
  inProgress: any[];

  @Prop({
    type: [{ course: mongoose.Schema.Types.ObjectId, date: Date }],
    ref: 'finished',
  })
  finished: any[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'wishList',
  })
  wishList: any[];

  @Prop({
    type: [{ video: mongoose.Schema.Types.ObjectId, scored: Number }],
    ref: 'Video',
  })
  scored: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);
