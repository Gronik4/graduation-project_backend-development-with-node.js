import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './Users/users.module';
import { HotelModule } from './Hotels/hotel/hotel.module';
import { HotelRoomModule } from './hotels/hotel-room/hotel-room.module';

@Module({
  imports: [UsersModule, HotelModule, HotelRoomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
