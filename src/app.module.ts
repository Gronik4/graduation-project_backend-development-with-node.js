import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { HotelModule } from './Hotels/hotel/hotel.module';
import { HotelRoomModule } from './Hotels/hotelRoom/hotel-room.module';
import { ReservationModule } from './Reservation/reservation.module';

@Module({
  imports: [UsersModule, HotelModule, HotelRoomModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
