import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop()
  name: string;

  @Prop()
  description: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
