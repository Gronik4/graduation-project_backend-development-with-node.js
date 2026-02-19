import { typeId } from 'src/Users/Interfaces/param-id';
import { ReservationSearchOptions } from './ReservationSearchOptions';
import { Reservation } from '../schemas/reservation.schema';
import { ReservationDto } from './dto/ReservationDto';

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation> | string;
  removeReservation(id: typeId): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
