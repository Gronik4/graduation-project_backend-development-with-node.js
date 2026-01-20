import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { typeId } from '../../Users/Interfaces/param-id';

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
  @Prop({ ref: 'Hotel', required: true })
  hotel: typeId;

  @Prop()
  description: string;

  @Prop({ default: [] })
  images: string[];

  @Prop({ required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true, default: true })
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
