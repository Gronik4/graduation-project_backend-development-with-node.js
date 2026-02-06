import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
