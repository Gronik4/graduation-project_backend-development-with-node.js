/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
//import { pathToRegexp } from 'path-to-regexp'; // Это перенести в support-requests guard
import { UsersService } from 'src/Users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { typeId } from 'src/Users/Interfaces/param-id';

@Injectable()
export class AuthUserGuard extends AuthGuard('local') /*implements CanActivate*/ {
  constructor(private readonly userSrv: UsersService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.originalUrl === '/api/auth/login') {
      const validUser = (await super.canActivate(context)) as boolean;
      if (!validUser) return false;
      const validateUser = this.handleRequest(null, request.user);
      if (validateUser && request.session) {
        request.session.userId = validateUser.id;
      }
      return true;
    }
    console.log('request.session.userId', request.session.userId);
    if (!request.session.userId) {
      throw new HttpException('Пользователь не авторизован.', 401);
    }
    const userRole = await this.userSrv.findById(request.session.userId as typeId);
    const reqUrl: string = request.originalUrl;
    const result = reqUrl.split('/')[2] === userRole?.role ? true : 0;
    if (result != 0) {
      console.log('Роль подходит');
    }
    if (result === 0) throw new HttpException('Роль пользователя не подходит.', 403);
    return true;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new Error('Authentication failed');
    }
    return user;
  }
  /* Этот блок перенести в support-requests guard и доработать!!
  checkingRights(url: string, user: User): boolean | number {
    if (!url || !user) {
      console.log('Оба аргумента или один из них не имеют значения');
      return false;
    }*/
  /* Этот блок перенести в support-requests guard
    const allowedUrl = [
      pathToRegexp('/api/common/support-requests/:id/messages'),
      pathToRegexp('/api/common/support-requests/:id/messages/read'),
    ];
    allowedUrl.forEach(async (item) => {
      if (item.regexp.test(url)) {
        void (await this.checkingId());
      }
    });
    
  }*/
}
