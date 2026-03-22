/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import type { typeId } from 'src/Users/Interfaces/param-id';
import type { ReservationDto } from './Interfaces/dto/ReservationDto';
import { CreateReserveInterceptor } from './interceptors/createReserveInterceptor';
import type { ReservationSearchOptions } from './Interfaces/ReservationSearchOptions';
import { AuthUserGuard } from 'src/guards/auth.guard';
import { IdReservationGuard } from 'src/guards/id-reservation.guard';
import moment from 'moment';

@Controller('/api')
export class ReservationController {
  constructor(private readonly RrnService: ReservationService) {}

  @Post('/client/reservations') //Метод проверен
  @UseGuards(AuthUserGuard)
  @UseInterceptors(CreateReserveInterceptor)
  reserve(@Body() data: ReservationDto) {
    return this.RrnService.addReservation(data);
  }

  @Get('/client/reservations')
  @UseGuards(AuthUserGuard)
  getReservationsByClient(@Req() req) {
    const sesionId = req.session?.userId;
    const filters: ReservationSearchOptions = { userId: sesionId as typeId };
    return this.RrnService.getReservations(filters);
  }

  @Get('/manager/reservations/:id') //Метод проверен
  @UseGuards(AuthUserGuard)
  getReservations(
    @Param('id, dateStart, dateEnd') id: string,
    dateStart?: string,
    dateEnd?: string,
  ) {
    const filters: ReservationSearchOptions = {
      userId: id as typeId,
      dateStart: moment(dateStart).toDate(),
      dateEnd: moment(dateEnd).toDate(),
    };
    return this.RrnService.getReservations(filters);
  }

  @Delete('/client/reservations/:id') // Метод проверен
  @UseGuards(AuthUserGuard, IdReservationGuard)
  async removeByClient(@Param('id') id: typeId): Promise<void> {
    await this.RrnService.removeReservation(id);
  }

  @Delete('/manager/reservations/:id')
  @UseGuards(AuthUserGuard)
  async removeByManager(@Param('id') id: typeId): Promise<void> {
    await this.RrnService.removeReservation(id);
  }
}
