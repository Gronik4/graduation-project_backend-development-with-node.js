import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/Users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserSecret } from '../../project-config/token_config';
//import { LocalStrategy } from './local.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Users/schemas/user.schema';
import { UsersService } from 'src/Users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ session: true }),
    JwtModule.register({ secret: UserSecret.TnSct }),
    UsersModule,
  ],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
