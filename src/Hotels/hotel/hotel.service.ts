import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from '../Schemas/hotel.schema';
import { Connection, Model } from 'mongoose';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}
}
