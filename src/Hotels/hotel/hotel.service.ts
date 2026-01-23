/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from '../Schemas/hotel.schema';
import { Connection, Model } from 'mongoose';
import { createHotelDto } from '../Interfaces/dto/createHotelDto';
import { IHotelService } from '../Interfaces/IHotelService';
import { typeId } from 'src/Users/Interfaces/param-id';
import { SearchHotelParams } from '../Interfaces/SearchHotelParams';
import { UpdateHotelParams } from '../Interfaces/UpdateHotelParams';

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(data: createHotelDto): Promise<Partial<HotelDocument> | null> {
    const hotel = new this.HotelModel(data);
    try {
      await hotel.save();
      const findHotel = await this.HotelModel.findOne({ _id: hotel._id })
        .select('_id title description')
        .exec();
      return findHotel;
    } catch (err) {
      throw err;
    }
  }

  async getAllHotels(): Promise<Partial<HotelDocument>[]> {
    return this.HotelModel.find().select('_id title description').exec();
  }

  async findById(id: typeId): Promise<Hotel | null> {
    return await this.HotelModel.findOne({ _id: id });
  }

  async search(params: SearchHotelParams): Promise<Hotel[] | null> {
    return await this.HotelModel.findOne({ title: params.title });
  }

  async update(id: typeId, data: UpdateHotelParams): Promise<Hotel | null> {
    const findHotel = await this.findById(id);
    if (findHotel) {
      findHotel.title = data.title;
      findHotel.description = data.description;
    }
    return findHotel;
  }
}
