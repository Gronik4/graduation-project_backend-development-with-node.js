/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
//import { ReservationSearchOptions } from './Interfaces/ReservationSearchOptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, ObjectId, Types } from 'mongoose';
import { outReservation } from './Interfaces/OutReservation';
import moment from 'moment';
import 'moment/locale/ru';
import { HotelService } from 'src/Hotels/hotel/hotel.service';
import { HotelRoomService } from 'src/Hotels/hotelRoom/hotel-room.service';
import { HotelRoom } from 'src/Hotels/Schemas/hotel.room.schema';
import { Hotel } from 'src/Hotels/Schemas/hotel.schema';
import { typeId } from 'src/Users/Interfaces/param-id';
import { ReservationDto } from './Interfaces/dto/ReservationDto';
//import { IReservation } from './Interfaces/IReservation';

@Injectable()
export class ReservationService {
  newReserv: outReservation | null;
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @InjectConnection() private connection: Connection,
    @InjectModel(Hotel.name) private readonly hotelService: HotelService,
    @InjectModel(HotelRoom.name) private readonly HRService: HotelRoomService,
  ) {
    this.newReserv = null;
  }
  async addReservation(data: ReservationDto) {
    console.log(`data from service: ${JSON.stringify(data.roomId)}`);
    if (!(await this.reservationModel.findOne({ roomId: data.roomId }))) {
      throw new HttpException('Номера с указанным ID не существует', 400);
    }
    /*try {
      const occupied = await this.getReserveByRooms(data.roomId);
      const isoDateEnd = new Date(data.dateEnd);
      const isoDateStart = new Date(data.dateStart);
      if (
        occupied?.length === 0 ||
        occupied?.every(
          (item) =>
            moment(item.dateEnd).isBefore(isoDateStart) || // true, если item.dateEnd строго раньше isoDateStart.
            (moment(item.dateStart).isAfter(isoDateEnd) &&
              moment(item.dateEnd).isAfter(isoDateStart)),
        )
      ) {
        data.dateEnd = isoDateEnd;
        data.dateStart = isoDateStart;
        const newReservation = new this.reservationModel(data);
        await newReservation.save();
        const output = await this.dataOutput(newReservation._id);
        return output;
      } else {
        throw new HttpException(
          'Номер с указанным ID уже занят на указанную дату.',
          404,
        );
      }
    } catch (err) {
      throw err;
    }*/
    return 'Это наладка Imterceptor';
  }
  /*Метод проверен*/
  async removeReservation(id: typeId): Promise<void> {
    const deleted = await this.reservationModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new HttpException('Бронирования с таким id не существует', 400);
    }
  }
  /*
  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {}
*/
  async getReserveByRooms(id: ObjectId): Promise<Reservation[] | null> {
    return await this.reservationModel
      .find({ roomId: id })
      .select('-__v')
      .exec();
  }

  async getReserveByClients(id: string): Promise<Reservation[] | null> {
    return await this.reservationModel
      .find({ userId: id })
      .select('-__v')
      .exec();
  }

  async dataOutput(id: Types.ObjectId): Promise<outReservation | string> {
    try {
      const outData = await this.reservationModel.findById(id).select('-__v');
      if (!outData)
        throw new HttpException('Бронирование с таким id не найдено', 404);
      const DSString = moment(outData.dateStart).format('D MMMM YYYY');
      const DEString = moment(outData.dateEnd).format('D MMMM YYYY');
      const hotelObj = await this.hotelService.findById(outData.hotelId);
      const room = await this.HRService.findById(outData.roomId);
      if (!hotelObj || !room) {
        throw new HttpException(
          'Гостиница или номер не найдены. Либо указанный номер отключен',
          400,
        );
      }
      this.newReserv = {
        startDate: DSString,
        endDate: DEString,
        hotel: { title: hotelObj.title, description: hotelObj.description },
        hotelRoom: { description: room.description, images: room.images },
      };
      return this.newReserv;
    } catch (err) {
      throw err;
    }
  }
}
