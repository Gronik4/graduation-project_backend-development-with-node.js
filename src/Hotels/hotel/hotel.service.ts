/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from '../Schemas/hotel.schema';
import { Connection, Model, Types } from 'mongoose';
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

  async findById(id: Types.ObjectId): Promise<Hotel | string> {
    const findHotel = await this.HotelModel.findOne({ _id: id })
      .select('- __v')
      .exec();
    if (findHotel) {
      return findHotel;
    } else {
      return 'Нет гостиницы с таким id';
    }
  }

  async search(params: SearchHotelParams): Promise<Hotel[] | string> {
    let findHotels: Hotel[];
    if (params.name) {
      findHotels = await this.HotelModel.find(
        (h: { title: string | string[] }) => h.title.includes(params.name),
      );
      return findHotels.slice(params.offset, params.offset + params.limit);
    } else {
      return 'По таким параметрам ни чего не найдено.';
    }
  }

  async update(id: typeId, data: UpdateHotelParams): Promise<Hotel | string> {
    const findHotel = await this.HotelModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .select('- __v')
      .exec();
    if (findHotel) {
      return findHotel;
    } else {
      return 'Обновление не выполнено. Нет гостиницы с таким id.';
    }
  }
}
