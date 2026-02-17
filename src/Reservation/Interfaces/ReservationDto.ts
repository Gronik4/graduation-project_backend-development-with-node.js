import { ObjectId } from 'mongoose';
import { typeId } from '../../Users/Interfaces/param-id';

export interface ReservationDto {
  userId: typeId;
  hotelId: typeId;
  roomId: ObjectId;
  dateStart: Date;
  dateEnd: Date;
}
