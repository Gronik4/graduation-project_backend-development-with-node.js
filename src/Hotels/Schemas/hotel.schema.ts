import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { ObjectId } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {
  @Prop()
  id: ObjectId;

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
