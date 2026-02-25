/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.auth.dto';
import { User } from 'src/Users/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authSRV: AuthService) {
    console.log(' Validate method invoked from LocalStrategy');
    super();
  }

  async validate(data: LoginAuthDto): Promise<User | string> {
    const user = await this.authSRV.validateUser(data);
    console.log('from LocalStrategy user:', user);
    if (!user) {
      return 'Not authorized';
    }
    return user;
  }
}
