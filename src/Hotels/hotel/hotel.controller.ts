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

  @Post('/admin/hotels/') // Метод проверен
  create(@Body() body: createHotelDto): Promise<Partial<HotelDocument> | null> {
    return this.hotelHSV.create(body);
  }

  @Get('/admin/hotels/all/') // Метод проверен
  getAllHotels(): Promise<Partial<HotelDocument>[]> {
    return this.hotelHSV.getAllHotels();
  }

  @Get('/admin/hotels') // Метод проверен
  searchHotel(@Query() params) {
    return this.hotelHSV.search(params);
  }

  @Put('/admin/hotels/:id') // Метод проверен
  updateHotel(@Param() id: typeId, @Body() body: UpdateHotelParams) {
    return this.hotelHSV.update(id, body);
  }
}
