import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/Users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserSecret } from '../../project-config/token_config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Users/schemas/user.schema';
import { UsersService } from 'src/Users/users.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({ secret: UserSecret.TnSct, signOptions: { expiresIn: '7d' } }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, LocalStrategy],
})
export class AuthModule {}
