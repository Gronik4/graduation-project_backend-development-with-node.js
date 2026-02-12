/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { HotelService } from '../hotel/hotel.service';
import path from 'path';
import fs from 'fs';

@Injectable()
export class RoomFilesInterceptor implements NestInterceptor {
  allowedTypes: string[];
  dir: string;
  constructor(private readonly HlServise: HotelService) {
    this.allowedTypes = [
      'image/png',
      'image/jpg',
      'image/jpeg',
      'application/pdf',
    ]; // Разрешенные типы файлов
    this.dir = 'imgStorage';
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest(); // Перехват тела запроса
    if (!request.files || !Array.isArray(request.files))
      return next.handle().pipe(map(() => 'Не передано ни одного файла.'));
    for (const file of request.files) {
      if (typeof file === 'string') return next.handle();
      if (!this.fileFilter(file.mimetype)) {
        return next.handle().pipe(map(() => 'Недопустимый тип файла.'));
      }
      const filePath = path.join(this.dir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
    }
    const newBody = { ...request.body };
    newBody.images = [];
    for (const file of request.files) {
      if (typeof file === 'string') return next.handle();
      newBody.images.push(`${this.dir}/${file.originalname}`);
    }
    request.body = newBody;
    return next.handle().pipe(map((data) => data));
  }

  fileFilter(mimeType: string): boolean {
    return this.allowedTypes.includes(mimeType) ? true : false;
  }
}
