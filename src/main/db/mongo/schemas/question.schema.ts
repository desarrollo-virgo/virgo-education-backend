import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from './course.schema';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop({
    type: [
      {
        question: String,
        number: Number,
        options: [{ option: String, number: Number, correct: Boolean }],
      },
    ],
  })
  questions: any;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Video' })
  video: mongoose.Schema.Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
