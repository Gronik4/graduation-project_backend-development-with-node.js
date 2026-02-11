/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { createRoomDto } from '../Interfaces/dto/createRoomDto';
import { HotelService } from '../hotel/hotel.service';
//import { title } from 'process';

@Injectable()
export class RoomFilesInterceptor implements NestInterceptor {
  allowedTypes: string[];
  constructor(private readonly HlServise: HotelService) {
    this.allowedTypes = ['image/png', 'image/jpg', 'application/pdf']; // Разрешенные типы файлов
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const originalData = request.body as createRoomDto; // Перехват тела запроса
    //const hotel = await this.HlServise.findById(originalData.hotel)[title];
    //const uploadDir = `../../imgStorage/${hotel}`;
    originalData.images.forEach((el) => {
      if (typeof el != 'string') {
        if (!this.fileFilter(el))
          return next.handle().pipe(map(() => 'Недопустимый тип файла.'));
      }
    });
    return next.handle().pipe(map(() => originalData)); // Дописать!!!!
  }

  fileFilter(file: File): boolean {
    return this.allowedTypes.includes(file.type) ? true : false;
  }
}
