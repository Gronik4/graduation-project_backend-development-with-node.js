import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { HotelRoom } from '../Schemas/hotel.room.schema';
import { Connection, Model } from 'mongoose';

@Injectable()
export class HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name) private Hotelroom: Model<HotelRoom>,
    @InjectConnection() private connection: Connection,
  ) {}
}
