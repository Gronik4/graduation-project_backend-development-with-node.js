import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/Users/schemas/user.schema';
import type { createUserDto } from 'src/Users/Interfaces/dto/createUserDto';
import type { LoginAuthDto } from './dto/login.auth.dto';

@Controller('/api')
export class AuthController {
  constructor(private readonly authSrv: AuthService) {}

  @Post('/client/register')
  registerUser(@Body() data: createUserDto): Promise<UserDocument | null> {
    return this.authSrv.register(data);
  }

  @Post('/auth/login')
  loginUser(@Query() data: LoginAuthDto): Promise<object | string> {
    return this.authSrv.login(data);
  }

  @Post('/auth/logout')
  LoguotUser() {}
}
