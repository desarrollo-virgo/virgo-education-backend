import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DirectivesDocument = HydratedDocument<Directives>;

@Schema({ timestamps: true })
export class Directives {
  @Prop()
  name: string;

  @Prop()
  address: string;
}

export const DirectivesSchema = SchemaFactory.createForClass(Directives);
