/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { ReservationDto } from './Interfaces/ReservationDto';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
//import { ReservationSearchOptions } from './Interfaces/ReservationSearchOptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, ObjectId } from 'mongoose';
//import { IReservation } from './Interfaces/IReservation';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectConnection() private connection: Connection,
  ) {}
  async addReservation(
    data: ReservationDto,
  ): Promise<string | ReservationDocument> {
    console.log('occupied from service method addReservation:');
    const dateNow = new Date(data.dateStart);
    console.log(`data.dateStart: ${dateNow.toISOString()}`);
    try {
      const occupied = await this.getReserveRoom(data.roomId);
      console.log(occupied);
      if (occupied?.length === 0) {
        throw new HttpException(
          'Номера с указанным ID не существует или он отключён.',
          404,
        );
      }
      /*if (!occupied.every((item) => item.dateEnd >= data.dateStart)) {
        return 'Комната уже занята в эти даты';
      }*/

      //const newReservation = new this.reservationModel(data);
      return 'Метод addReservation в разработке';
    } catch (err) {
      throw err;
    }
  }
  /*
  async removeReservation(id: typeId): Promise<void> {}

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {}
*/
  async getReserveRoom(id: ObjectId): Promise<Reservation[] | null> {
    return await this.reservationModel
      .find({ roomId: id })
      .select('-__v')
      .exec();
  }
}
