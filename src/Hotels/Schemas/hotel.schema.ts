import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type HotelDocument = Hotel & mongoose.Document;

@Schema()
export class Hotel {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  createdAt: mongoose.Date;
}
