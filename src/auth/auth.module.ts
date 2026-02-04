import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/Users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserSecret } from '../../project-config/token_config';
import { UsersService } from 'src/Users/users.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: UserSecret.TnSct }),
  ],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
