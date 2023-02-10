import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
    type: { nombre: String, rut: String },
  })
  sostenedor: {
    name: string;
    rut: string;
  };
}

export const DirectivesSchema = SchemaFactory.createForClass(Directives);
