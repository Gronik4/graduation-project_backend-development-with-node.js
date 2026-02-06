/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-fallthrough */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { typeId } from './Interfaces/param-id';
import { SearchUserParams } from './Interfaces/SearchUserParams';
import { User, UserDocument } from './schemas/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { createUserDto } from './Interfaces/dto/createUserDto';
import { IUserService } from './Interfaces/IUserService';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements IUserService {
  fields: string;
  newUser: any | null;
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {
    this.fields = '_id email name contactPhone createAt';
    this.newUser = null;
  }
  async create(data: createUserDto): Promise<UserDocument | null> {
    const updateUser = await this.findByEmail(data.email);
    if (updateUser) {
      const updUser = {
        ...updateUser,
        role: data.role,
        createAt: data.createAT,
      };
      this.newUser = new this.UserModel(updUser);
    } else {
      /* Генерируем простой временный пароль клиента*/
      const ClientTempPass = generate({
        length: 7,
        numbers: true,
        uppercase: true,
        lowercase: true,
        strict: true,
      });
      const hashPass = await bcrypt.hash(ClientTempPass, 10);
      const nextUser = { ...data, passwordHash: hashPass };
      this.newUser = new this.UserModel(nextUser);
    }
    try {
      await this.newUser.save();
      const user = await this.UserModel.findById({ _id: data.id })
        .select('- __v')
        .exec();
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findById(id: typeId): Promise<UserDocument | null> {
    try {
      const findUser = await this.UserModel.findById(id)
        .select(this.fields)
        .exec();
      return findUser;
    } catch (err) {
      throw err;
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    try {
      const findUser = await this.UserModel.findOne({ email })
        .select('_id email passwordHash name contactPhone createAt')
        .exec();
      return findUser;
    } catch (err) {
      throw err;
    }
  }

  async findAll(params: SearchUserParams): Promise<User[] | null> {
    const findUsers: User[] = [];
    for (const key in params) {
      switch (key) {
        case 'name':
          if (params.name) {
            const findOnName = await this.UserModel.find(
              (u: { name: string }) => u.name.includes(params.name),
            )
              .select(this.fields)
              .exec();
            findUsers.push(...findOnName);
          }
        case 'email':
          if (params.email) {
            const findOnEmail = await this.UserModel.find(
              (u: { email: string }) => u.email.includes(params.email),
            )
              .select(this.fields)
              .exec();
            findUsers.push(...findOnEmail);
          }
        case 'contactPhone':
          if (params.contactPhone) {
            const findOnPhone = await this.UserModel.find(
              (u: { contactPhone: string }) =>
                u.contactPhone.includes(params.contactPhone),
            )
              .select(this.fields)
              .exec();
            findUsers.push(...findOnPhone);
          }
          break;
        default: {
          {
            const findAllUsers = await this.UserModel.find()
              .select(this.fields)
              .exec();
            findUsers.push(...findAllUsers);
          }
        }
      }
    }
    return findUsers.slice(params.offset, params.offset + params.limit);
  }
}
