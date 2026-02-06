/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { createUserDto } from 'src/Users/Interfaces/dto/createUserDto';
import { User, UserDocument } from 'src/Users/schemas/user.schema';
import { LoginAuthDto } from './dto/login.auth.dto';
import { UsersService } from 'src/Users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

  async register(data: createUserDto): Promise<UserDocument | null> {
    const hashPassword = await bcrypt.hash(data.passwordHash, 10);
    const newData = { ...data, passwordHash: hashPassword };
    this.newUser = new this.UserModel(newData);
    try {
      await this.newUser.save();
      const findUser = await this.UserModel.findById({ _id: this.newUser.id })
        .select('_id email password name')
        .exec();
      return findUser;
    } catch (err) {
      throw err;
    }
  }

  async login(data: LoginAuthDto): Promise<object | string> {
    const validUser = await this.validateUser(data);
    if (validUser) {
      return {
        email: validUser.email,
        name: validUser.name,
        contactPhone: validUser.contactPhone,
      };
    }
    return 'Staus Code 401. Пользователя с указанным email не существует или пароль неверный.';
  }

  async logout() {}

  async validateUser(data: LoginAuthDto): Promise<User | null> {
    const user = await this.UserSRV.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return null;
    }
    return user;
  }

  createToken(paylod: any) {
    return this.jwtService.sign(paylod);
  }
}
