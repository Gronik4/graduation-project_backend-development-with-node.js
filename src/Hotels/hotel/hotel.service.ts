import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from '../Schemas/hotel.schema';
import { Connection, Model } from 'mongoose';
import { createHotelDto } from '../Interfaces/dto/createHotelDto';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  create(data: createHotelDto): Promise<HotelDocument> {
    console.log('hotel.service.create');
    const hotel = new this.HotelModel(data);
    if (!hotel) {
      throw new Error('Method hotel.service.create not implemented.');
    }
    return hotel.save();
  }
}
