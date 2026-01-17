import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { typeId } from 'src/Users/Interfaces/param-id';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true })
  userId: typeId;

  @Prop({ required: true })
  hotelId: typeId;

  @Prop({ required: true })
  roomId: typeId;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
