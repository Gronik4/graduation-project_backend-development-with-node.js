/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { createUserDto } from 'src/Users/Interfaces/dto/createUserDto';
import { User, UserDocument } from 'src/Users/schemas/user.schema';
import { loginUserDto } from '../auth/dto/loginUserDto';
import { UsersService } from 'src/Users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
    private readonly UserSRV: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: createUserDto): Promise<UserDocument | null> {
    const hashPassword = bcrypt.hash(data.passwordHash, 10);
    data.passwordHash = hashPassword;
    const newUser = new this.UserModel(data);
    try {
      await newUser.save();
      const findUser = await this.UserModel.findById({ id: newUser.id })
        .select('email password name contactPhone')
        .exec();
      return findUser;
    } catch (err) {
      throw err;
    }
  }

  async login(data: loginUserDto): Promise<object | null> {
    const validUser = await this.validateUser(data);
    if (validUser) {
      return {
        email: validUser.email,
        name: validUser.name,
        contactPhone: validUser.contactPhone,
      };
    }
    return null;
  }

  async logout() {}

  async validateUser(data: loginUserDto): Promise<User | null> {
    const user = await this.UserSRV.findByEmail(data.email);
    if (!user || !bcrypt.compare(data.password, user.passwordHash)) {
      return null;
    }
    return user;
  }

  createToken(paylod: any) {
    return this.jwtService.sign(paylod);
  }
}
