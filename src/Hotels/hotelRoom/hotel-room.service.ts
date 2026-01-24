/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomDocument } from '../Schemas/hotel.room.schema';
import { Connection, Model } from 'mongoose';
import { createRoomDto } from '../Interfaces/dto/createRoomDto';
import { ShowRoomData } from '../Interfaces/ShowRoomData';
import { HotelService } from '../hotel/hotel.service';

@Injectable()
export class HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name) private HotelRoom: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection,
    private readonly HlServise: HotelService,
  ) {}

  async create(data: createRoomDto): Promise<Partial<ShowRoomData> | null> {
    const room = new this.HotelRoom(data);
    let outRoom;
    try {
      await room.save();
      const findRoom = await this.HotelRoom.findOne({ _id: room._id })
        .select('- __v')
        .exec();
      if (findRoom) {
        const findHotel = this.HlServise.findById(room.hotel);
        outRoom = {
          ...findRoom,
          hotel: {
            ...findHotel,
          },
        };
      }
      return outRoom;
    } catch (err) {
      throw err;
    }
  }
}
