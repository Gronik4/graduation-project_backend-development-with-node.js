import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';
import type { createRoomDto } from '../Interfaces/dto/createRoomDto';
import { RoomFilesInterceptor } from '../interseptors/roomFilesInterseptor';

@Controller('/api')
export class HotelRoomController {
  constructor(private readonly hotelRSV: HotelRoomService) {}

  @Get('/common/hotel-rooms')
  getAllHotelRooms() {}

  @Get('/common/hotel-rooms/:id')
  getHotelRoom() {}

  @Post('/admin/hotel-rooms')
  @UseInterceptors(RoomFilesInterceptor)
  createHotelRoom(@Body() body: createRoomDto) {
    console.log(body);
  }

  @Put('/admin/hotel-rooms/:id')
  updateHotelRoom() {}
}
