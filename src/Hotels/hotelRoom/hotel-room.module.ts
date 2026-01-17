import { Module } from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from '../Schemas/hotel.room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HotelRoom.name,
        schema: HotelRoomSchema,
      },
    ]),
  ],
  controllers: [HotelRoomController],
  providers: [HotelRoomService],
})
export class HotelRoomModule {}
