///* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/Users/schemas/user.schema';
import { pathToRegexp } from 'path-to-regexp';
import { UsersService } from 'src/Users/users.service';
import { typeId } from 'src/Users/Interfaces/param-id';
//import { ReservationService } from 'src/Reservation/reservation.service';
//import { Types } from 'mongoose';

@Injectable()
export class AuthUserGuard /*extends AuthGuard('local') */ implements CanActivate {
  reqId: string;
  sessId: string;
  constructor(
    private readonly userSrv: UsersService,
    //private readonly reserveSrv: ReservationService,
  ) {
    this.reqId = '';
    this.sessId = '';
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    this.sessId = request.session.userId;
    this.reqId = request.params.id;
    if (!this.sessId) throw new HttpException('Пользователь не авторизован.', 401);
    console.log('From AuthUserGuard, sessionId: ', this.sessId);
    const user = await this.userSrv.findById(this.sessId as typeId);
    if (!user) {
      throw new HttpException(
        'Пользователя с указанным email не существует или пароль неверный. Guard',
        401,
      );
    }
    const resultChecking = this.checkingRights(request.originalUrl, user);
    if (resultChecking === 0)
      throw new HttpException('Роль пользователя не подходит.', 403);
    console.log(
      `From AuthUserGuard, id reserv:  ${request.params.id} method: ${request.method}`,
    );
    /*if (user.role === 'client' && request.method === 'DELETE')
      void (await this.checkingId());*/
    return true;
  }

  checkingRights(url: string, user: User): boolean | number {
    if (!url || !user) {
      console.log('Оба аргумента или один из них не имеют значения');
      return false;
    }
    /* Этот блок проверять в support-requests. От сюда*/
    const allowedUrl = [
      pathToRegexp('/api/common/support-requests/:id/messages'),
      pathToRegexp('/api/common/support-requests/:id/messages/read'),
    ];
    allowedUrl.forEach((item) => {
      if (item.regexp.test(url)) {
        //void (await this.checkingId());
        console.log(url);
      }
    });
    /* Этот блок проверять в support-requests. До сюда*/
    return url.split('/')[2] === user.role ? true : 0;
  }

  checkingId(): boolean {
    /*const reserv = await this.reserveSrv.getRserveById(
      this.reqId as unknown as Types.ObjectId,
    );*/
    if (/*reserv?.userId.toString()*/ !this.sessId)
      throw new HttpException(
        'Пользователь не может удалять бронь созданную другими.',
        403,
      );
    return true;
  }
}
