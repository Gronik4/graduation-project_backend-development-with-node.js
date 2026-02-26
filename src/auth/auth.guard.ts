/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
//import { Model } from 'mongoose';
import { User } from 'src/Users/schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { pathToRegexp } from 'path-to-regexp';

@Injectable()
export class AuthUserGuard /*extends AuthGuard('local') */ implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    //private readonly UserModel: Model<UserDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('from AuthUserGuard');
    const data: LoginAuthDto = request.body;
    if (!data.email || !data.password) {
      throw new HttpException('Не все данные переданы.', 400);
    }
    const user = await this.authService.validateUser(request.body);
    if (!user) {
      throw new HttpException(
        'Пользователя с указанным email не существует или пароль неверный. Guard',
        401,
      );
    }
    const resultChecking = this.checkingRights(request.originalUrl, user);
    if (resultChecking === 0)
      throw new HttpException('Роль пользователя не подходит.', 403);
    return true;
  }

  checkingRights(url: string, user: User): boolean | number {
    if (!url || !user) {
      console.log('Оба аргумента или один из них не имеют значения');
      return false;
    }
    /* Этот блок проверять в support-requests. От сюда*/
    const allowedUrl = [
      pathToRegexp('/api/common/support-requests/:id/messages'), // См. строку 12!!! Объявление URLPattern.
      pathToRegexp('/api/common/support-requests/:id/messages/read'),
    ];
    allowedUrl.forEach((item) => {
      if (item.regexp.test(url)) {
        // возвращает true, если шаблон совпал.
        const prepeaId = item.regexp.exec(url);
        console.log('prepeaId:', prepeaId);
        if (prepeaId) {
          const idUrl = prepeaId.groups?.id; // Получаем id из url
          console.log('idUrl:', idUrl);
          if (user.id) throw new HttpException('Роль пользователя не подходит.', 403);
          const isRoleValid = user.role === 'client' || user.role === 'manager';
          return isRoleValid;
        }
      }
    });
    /* Этот блок проверять в support-requests. До сюда*/
    console.log('from checkingRights, url.split()[2]:', url.split('/')[2]);
    console.log('from checkingRights, user.role:', user.role);
    console.log('from checkingRights, result', url.split('/')[2] === user.role);
    return url.split('/')[2] === user.role ? true : 0;
  }
}
