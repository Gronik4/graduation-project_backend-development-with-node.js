import { Module } from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';

@Module({
  providers: [HotelRoomService],
  controllers: [HotelRoomController]
})
export class HotelRoomModule {}
