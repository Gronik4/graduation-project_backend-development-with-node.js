/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { typeId } from 'src/Users/Interfaces/param-id';
import { UsersService } from 'src/Users/users.service';

@Injectable()
export class SupportRequestGuard implements CanActivate {
  constructor(private readonly userSrv: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedUrl = [
      '/api/common/support-requests/:id/messages',
      '/api/common/support-requests/:id/messages/read',
    ];
    const request = context.switchToHttp().getRequest();
    const reqUrl: string = request.originalUrl;
    if (allowedUrl.includes(reqUrl)) {
      const userForRole = await this.userSrv.findById(request.session.userId as typeId);
      const userRole = userForRole?.role;
      const result =
        reqUrl.split('/')[2] === 'common' &&
        (userRole === 'client' || userRole === 'manager')
          ? true
          : 0;
      if (result != 0) {
        console.log('Роль подходит');
        if (!result) throw new HttpException('Роль пользователя не подходит.', 403);
      }
    }
    return true;
  }
}
