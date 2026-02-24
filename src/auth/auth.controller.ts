/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Body, Controller, Post, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/Users/schemas/user.schema';
import type { LoginAuthDto } from './dto/login.auth.dto';
import type { RegistrAuthDto } from './dto/registr.auth.dto';

@Controller('/api')
export class AuthController {
  constructor(private readonly authSrv: AuthService) {}

  @Post('/client/register')
  registerUser(@Body() data: RegistrAuthDto): Promise<UserDocument | null> {
    return this.authSrv.register(data);
  }

  @Post('/auth/login')
  loginUser(@Body() data: LoginAuthDto): Promise<object | string> {
    return this.authSrv.login(data);
  }

  @Post('/auth/logout')
  async LogoutUser(@Response() res): Promise<void> {
    await res.clearCookie('access_token');
  }
}
