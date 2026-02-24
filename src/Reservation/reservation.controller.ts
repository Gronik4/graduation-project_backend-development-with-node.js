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
import type { ReservationSearchOptions } from './Interfaces/ReservationSearchOptions';

@Controller('/api')
export class ReservationController {
  constructor(private readonly RrnService: ReservationService) {}

  @Post('/client/reservations') //Метод проверен
  @UseInterceptors(CreateReserveInterceptor)
  reserve(@Body() data: ReservationDto) {
    return this.RrnService.addReservation(data);
  }

  @Get('/client/reservations')
  getReservationsByClient(@Param('id') id: string) {
    const filters: ReservationSearchOptions = { userId: id as typeId };
    return this.RrnService.getReservations(filters);
  }

  @Get('/manager/reservations/:id') //Метод проверен
  getReservations(@Param('id') id: string) {
    const filters: ReservationSearchOptions = { userId: id as typeId };
    return this.RrnService.getReservations(filters);
  }

  @Delete('/client/reservations/:id') // Метод проверен
  removeByClient(@Param('id') id: typeId) {
    return this.RrnService.removeReservation(id);
  }

  @Delete('/manager/reservations/:id')
  removeByManager(@Param('id') id: typeId) {
    return this.RrnService.removeReservation(id);
  }
}
