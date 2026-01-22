import { Body, Controller, Post } from '@nestjs/common';
import { HotelService } from './hotel.service';
import type { createHotelDto } from '../Interfaces/dto/createHotelDto';
import { HotelDocument } from '../Schemas/hotel.schema';

@Controller('/api')
export class HotelController {
  constructor(private readonly hotelHSV: HotelService) {}

  @Post('admin/hotels/')
  create(@Body() body: createHotelDto): Promise<HotelDocument> {
    return this.hotelHSV.create(body);
  }
}
