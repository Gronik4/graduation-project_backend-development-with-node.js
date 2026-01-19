import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { HotelModule } from './Hotels/hotel/hotel.module';
import { HotelRoomModule } from './Hotels/hotelRoom/hotel-room.module';
import { ReservationModule } from './Reservation/reservation.module';
import { MessageModule } from './SupportRequest/message/message.module';
import { SupportRequestModule } from './SupportRequest/support-request/support-request.module';

@Module({
  imports: [
    UsersModule,
    HotelModule,
    HotelRoomModule,
    ReservationModule,
    MessageModule,
    SupportRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
