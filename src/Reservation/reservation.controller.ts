import { Body, Controller, Post } from '@nestjs/common';
import type { ReservationDto } from './Interfaces/ReservationDto';
//import { ReservationDocument } from './schemas/reservation.schema';
import { ReservationService } from './reservation.service';

@Controller('/api')
export class ReservationController {
  constructor(private readonly RrnService: ReservationService) {}

  @Post('/client/reservations')
  reserve(@Body() data: ReservationDto) {
    return this.RrnService.addReservation(data);
  }
}
