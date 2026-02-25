/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument } from 'src/Users/schemas/user.schema';
import { LoginAuthDto } from './dto/login.auth.dto';
import { UsersService } from 'src/Users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegistrAuthDto } from './dto/registr.auth.dto';

@Injectable()
export class AuthService {
  newUser: any | null;
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
    private readonly UserSRV: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.newUser = null;
  }

  async register(req: Request, data: RegistrAuthDto): Promise<UserDocument | null> {
    const existUser = await this.UserSRV.findByEmail(data.email);
    if (existUser) {
      throw new HttpException('Email уже занят.', 400);
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    const newData = { ...data, passwordHash: hashPassword };
    this.newUser = new this.UserModel(newData);
    try {
      await this.newUser.save();
      const findUser = await this.UserModel.findById({ _id: this.newUser.id })
        .select('_id email name')
        .exec();
      return findUser;
    } catch (err) {
      throw err;
    }
  }

  login(data: User): object | null {
    if (data)
      return {
        email: data.email,
        name: data.name,
        contactPhone: data.contactPhone,
      };
    return null;
  }

  async validateUser(data: LoginAuthDto): Promise<User> {
    const user = await this.UserModel.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new HttpException(
        'Пользователя с указанным email не существует или пароль неверный.',
        401,
      );
    }
    return user;
  }

  createToken(paylod: any) {
    return this.jwtService.sign(paylod);
  }
}
