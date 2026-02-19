import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
//import { ReservationDocument } from './schemas/reservation.schema';
import { ReservationService } from './reservation.service';
import type { typeId } from 'src/Users/Interfaces/param-id';
import type { ReservationDto } from './Interfaces/dto/ReservationDto';
import { CreateReserveInterceptor } from './interceptors/createReserveInterceptor';

@Controller('/api')
export class ReservationController {
  constructor(private readonly RrnService: ReservationService) {}

  @Post('/client/reservations')
  @UseInterceptors(CreateReserveInterceptor)
  reserve(@Body() data: ReservationDto) {
    return this.RrnService.addReservation(data);
  }

  @Get('/manager/reservations/:userId')
  getReservations(@Param('userId') userId: string) {
    return this.RrnService.getReserveByClients(userId);
  }

  @Delete('/client/reservations/:id') // Метод проверен
  removeClient(@Param('id') id: typeId) {
    return this.RrnService.removeReservation(id);
  }

  @Delete('/manager/reservations/:id')
  removeManager(@Param('id') id: typeId) {
    return this.RrnService.removeReservation(id);
  }
}
