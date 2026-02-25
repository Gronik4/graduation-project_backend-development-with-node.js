/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Body,
  Controller,
  HttpException,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/Users/schemas/user.schema';
import type { LoginAuthDto } from './dto/login.auth.dto';
import type { RegistrAuthDto } from './dto/registr.auth.dto';
import { AuthUserGuard } from './auth.guard';

@Controller('/api')
export class AuthController {
  constructor(private readonly authSrv: AuthService) {}

  @Post('/client/register')
  registerUser(
    @Request() req: Request,
    @Body() data: RegistrAuthDto,
  ): Promise<UserDocument | null> {
    return this.authSrv.register(req, data);
  }

  @Post('/auth/login')
  @UseGuards(AuthUserGuard)
  async loginUser(
    @Request() req,
    @Body() data: LoginAuthDto,
  ): Promise<object | string | null> {
    console.log('from authController req:', req.user);
    const user = await this.authSrv.validateUser(data);
    if (user && req.session) {
      req.session.userId = user.id;
    } else {
      throw new HttpException('Session not found.', 500);
    }
    return this.authSrv.login(user);
  }

  @Post('/auth/logout')
  async LogoutUser(@Request() req): Promise<void> {
    await req.session.destroy();
  }
}
