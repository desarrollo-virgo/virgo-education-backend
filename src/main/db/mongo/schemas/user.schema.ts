import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from './course.schema';
import { Directives } from './directive.schema';
import { FinishedCourses } from './finishedCourses.schema';
import { Profile } from './profile.schema';
import { Video } from './video.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Directives' })
  directive: Directives[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Profile',
    unique: true,
  })
  profile: Profile[];

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
}

export const UserSchema = SchemaFactory.createForClass(User);
