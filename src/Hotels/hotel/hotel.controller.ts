import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { HotelService } from './hotel.service';
import type { createHotelDto } from '../Interfaces/dto/createHotelDto';
import { HotelDocument } from '../Schemas/hotel.schema';

@Controller('/api')
export class HotelController {
  constructor(private readonly hotelHSV: HotelService) {}

  @Post('/admin/hotels/')
  create(@Body() body: createHotelDto): Promise<Partial<HotelDocument> | null> {
    return this.hotelHSV.create(body);
  }

  @Get('/admin/hotels/')
  getAllHotels(): Promise<Partial<HotelDocument>[]> {
    return this.hotelHSV.getAllHotels();
  }

  @Put('/admin/hotels/:id')
  updateHotel() {}
}
