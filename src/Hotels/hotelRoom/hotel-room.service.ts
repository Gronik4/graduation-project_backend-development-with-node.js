/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomDocument } from '../Schemas/hotel.room.schema';
import { Connection, Model } from 'mongoose';
import { createRoomDto } from '../Interfaces/dto/createRoomDto';
import { ShowRoomData } from '../Interfaces/ShowRoomData';
import { HotelService } from '../hotel/hotel.service';
import { updateRoomDto } from '../Interfaces/dto/updateRoomDto';

@Injectable()
export class HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name) private HotelRoom: Model<HotelRoomDocument>,
    @InjectConnection() private connection: Connection,
    private readonly HlServise: HotelService,
  ) {}
  /**Метод проверен */
  async create(data: createRoomDto): Promise<Partial<ShowRoomData> | null> {
    const room = new this.HotelRoom(data);
    try {
      await room.save();
      return this.findById(String(room._id));
    } catch (err) {
      throw err;
    }
  }
  /**Метод проверен */
  async findById(id: string): Promise<Partial<ShowRoomData> | null> {
    let outRoom: Partial<ShowRoomData> | null = null;
    try {
      const findRoom = await this.HotelRoom.findOne({ _id: id })
        .select('-__v')
        .exec();
      if (findRoom) {
        const findHotel = await this.HlServise.findById(findRoom.hotel);
        outRoom = {
          ...findRoom.toObject(),
          hotel:
            typeof findHotel === 'object' && findHotel
              ? {
                  id: String(findHotel.id),
                  title: findHotel.title,
                  description: findHotel.description,
                }
              : undefined,
        };
      }
      return outRoom;
    } catch (err) {
      throw err;
    }
  }
  /**Метод проверен */
  async update(
    id: string,
    data: updateRoomDto,
  ): Promise<Partial<ShowRoomData> | null | string> {
    data.updatedAt = new Date();
    const updatedRoom = await this.HotelRoom.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (updatedRoom) {
      return this.findById(id);
    } else {
      return null;
    }
  }
}
