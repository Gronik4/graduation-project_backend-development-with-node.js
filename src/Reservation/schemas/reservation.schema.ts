import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Hotel } from 'src/Hotels/Schemas/hotel.schema';
import { User } from 'src/Users/schemas/user.schema';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId | User;

  @Prop({ required: true, type: Types.ObjectId })
  hotelId: Types.ObjectId | Hotel;

  @Prop({ required: true })
  roomId: Types.ObjectId;

  @Prop({ required: true })
  dateStart: Date;

  @Prop({ required: true })
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
