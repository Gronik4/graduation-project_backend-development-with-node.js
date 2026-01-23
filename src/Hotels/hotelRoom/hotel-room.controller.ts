import { Controller, Get, Post, Put } from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';

@Controller('/api')
export class HotelRoomController {
  constructor(private readonly hotelRSV: HotelRoomService) {}

  @Get('/common/hotel-rooms')
  getAllHotelRooms() {}

  @Get('/common/hotel-rooms/:id')
  getHotelRoom() {}

  @Post('/admin/hotel-rooms')
  createHotelRoom() {}

  @Put('/admin/hotel-rooms/:id')
  updateHotelRoom() {}
}
