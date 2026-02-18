/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { ReservationDto } from './Interfaces/ReservationDto';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
//import { ReservationSearchOptions } from './Interfaces/ReservationSearchOptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, ObjectId, Types } from 'mongoose';
import { outReservation } from './Interfaces/OutReservation';
import moment from 'moment';
import { HotelService } from 'src/Hotels/hotel/hotel.service';
import { HotelRoomService } from 'src/Hotels/hotelRoom/hotel-room.service';
import { HotelRoom } from 'src/Hotels/Schemas/hotel.room.schema';
import { Hotel } from 'src/Hotels/Schemas/hotel.schema';
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
    console.log('occupied from service method addReservation:');
    try {
      const occupied = await this.getReserveRooms(data.roomId);
      console.log(occupied);
      const isoDateStart = new Date(data.dateStart);
      if (
        occupied?.length === 0 ||
        occupied?.every((item) => moment(item.dateEnd).isBefore(data.dateStart)) // true, если item.dateEnd строго раньше data.dateStart
      ) {
        const isoDateEnd = new Date(data.dateEnd);
        data.dateEnd = isoDateEnd;
        data.dateStart = isoDateStart;
        const newReservation = new this.reservationModel(data);
        console.log('newReservation from service method addReservation:');
        console.log(newReservation);
        //await newReservation.save();
        const output = await this.dataOutput(occupied[0]._id); // Только для отладки!!! Исправить на newReservation._id после сохранения
        console.log('output from service method addReservation:');
        console.log(output);
      } else {
        throw new HttpException(
          'Номер с указанным ID уже занят на указанную дату.',
          404,
        );
      }
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
  async getReserveRooms(id: ObjectId): Promise<Reservation[] | null> {
    return await this.reservationModel
      .find({ roomId: id })
      .select('-__v')
      .exec();
  }

  async dataOutput(id: Types.ObjectId): Promise<outReservation | string> {
    const outData = await this.reservationModel.findById(id).select('-__v');
    if (!outData)
      throw new HttpException('Бронирование с таким id не найдено', 404);
    outData.dateStart = moment(outData.dateStart).format('LLL');
    outData.dateEnd = moment(outData.dateEnd).format('LLL');
    const hotelObj = await this.hotelService.findById(outData.hotelId);
    const room = await this.HRService.findById(outData.roomId);
    if (!hotelObj || !room) {
      throw new HttpException('Гостиница или номер не найдены', 404);
    }
    console.log('From dataOutput hotelObj:');
    console.log(hotelObj);
    /*this.newReserv = {
      startDate: outData.dateStart,
      endDate: outData.dateEnd,
      hotel: { title: hotelObj.title, description: hotelObj.description },
      hotelRoom: { description: room.description, images: room.images },
    };*/
    return 'Метод addReservation в разработке';
  }
}
