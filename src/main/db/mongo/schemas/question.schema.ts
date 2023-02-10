import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from './course.schema';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop()
  question: string;

  @Prop({
    type: [
      {
        option: String,
        number: Number,
        correct: Boolean,
      },
    ],
  })
  options: [
    {
      option: string;
      number: number;
      correct: boolean;
    },
  ];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Video' })
  video: mongoose.Schema.Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
