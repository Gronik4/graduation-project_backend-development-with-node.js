/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthUserGuard extends AuthGuard('local') implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // Передаёт управление стратегии
  }

  handleRequest(err: any, user: any) {
    console.log('from guard user', user);
    console.log('from guard err', err);
    if (err) throw err;
    if (!user) return { role: 'notAuth' };
    if (user) return user.role;
  }
}
