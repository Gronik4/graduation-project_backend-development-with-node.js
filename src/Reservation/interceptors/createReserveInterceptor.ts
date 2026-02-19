/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { map, Observable, tap } from 'rxjs';
import { HotelRoomService } from 'src/Hotels/hotelRoom/hotel-room.service';
import { ReservationDto } from '../Interfaces/dto/ReservationDto';

@Injectable()
export class CreateReserveInterceptor implements NestInterceptor {
  newData: ReservationDto | null;
  constructor(private readonly HRService: HotelRoomService) {
    this.newData = null;
  }
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest(); // Перехват тела запроса
    const data = request.body;
    if (!data) {
      throw new HttpException(
        'From Interceptor Нет данных в теле запроса',
        400,
      );
    }
    console.log('Данные из Interceptor data:', data);
    const room = await this.HRService.findById(data.hotelRoom);
    if (!room) {
      throw new HttpException(
        'From Interceptor Номера с указанным ID не существует',
        404,
      );
    }
    this.newData = {
      roomId: data.hotelRoom,
      userId: data.userId,
      hotelId: room.hotel ? room.hotel.id : data.hotelId,
      dateStart: new Date(data.dateStart), // Преобразование строки в объект Date ISO 8601
      dateEnd: new Date(data.dateEnd),
    };
    console.log('Данные из Interceptor this.newData:', this.newData);
    return next.handle().pipe(
      tap((response) => {
        console.log('Полученный ответ:', response); // Логика после завершения основной обработки
      }),
      map(() => 'Перехват из ReserveInterceptor'),
    );
  }

  convertToObjectId(id: string) {
    return new ObjectId(id);
  }
}
