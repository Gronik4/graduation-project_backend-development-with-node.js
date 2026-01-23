/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import type { createHotelDto } from '../Interfaces/dto/createHotelDto';
import { HotelDocument } from '../Schemas/hotel.schema';
import type { UpdateHotelParams } from '../Interfaces/UpdateHotelParams';
import type { typeId } from 'src/Users/Interfaces/param-id';

@Controller('/api')
export class HotelController {
  constructor(private readonly hotelHSV: HotelService) {}

  @Post('/admin/hotels/')
  create(@Body() body: createHotelDto): Promise<Partial<HotelDocument> | null> {
    return this.hotelHSV.create(body);
  }

  @Get('/admin/hotels/all/')
  getAllHotels(): Promise<Partial<HotelDocument>[]> {
    return this.hotelHSV.getAllHotels();
  }

  @Get('/admin/hotels')
  searchHotel(@Query() SearchHotelParams) {
    return this.hotelHSV.search(SearchHotelParams);
  }

  @Put('/admin/hotels/:id')
  updateHotel(@Param() id: typeId, @Body() body: UpdateHotelParams) {
    return this.hotelHSV.update(id, body);
  }
}
