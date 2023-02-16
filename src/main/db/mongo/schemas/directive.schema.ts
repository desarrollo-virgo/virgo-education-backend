import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DirectivesDocument = HydratedDocument<Directives>;

@Schema({ timestamps: true })
export class Directives {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop({
    type: { name: String, rut: String },
  })
  sostenedor: {
    name: string;
    rut: string;
  };

  @Prop({ type: [mongoose.Schema.Types.ObjectId] })
  excludeCourses: string[];
}

export const DirectivesSchema = SchemaFactory.createForClass(Directives);
