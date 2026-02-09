/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
    this.fields = '_id email name contactPhone role';
    this.newUser = null;
  }
  async create(data: createUserDto): Promise<UserDocument | null> {
    const updateUser = await this.UserModel.findOne({ email: data.email });
    let updData = {};
    if (updateUser) {
      updData = {
        role: data.role,
        whoCreate: data.whoCreate,
      };
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
      this.newUser
        ? await this.newUser.save()
        : await this.UserModel.findByIdAndUpdate(
            { _id: updateUser?.id },
            updData,
            { new: true },
          );
      const id = this.newUser ? this.newUser._id : updateUser?._id;
      const user = await this.UserModel.findById({ _id: id })
        .select(this.fields)
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
        .select('_id email passwordHash name contactPhone whoCreate')
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
            console.log(`From params.name: ${params.name}`);
            const findOnName = await this.UserModel.find({
              name: { $regex: params.name },
            }).select(this.fields);
            findUsers.push(...findOnName);
            console.log(findUsers);
          } else console.log('Name - empty');
        case 'email':
          if (params.email) {
            console.log(`params.email: ${params.email}`);
            const findOnEmail = await this.UserModel.find({
              email: { $regex: params.email },
            }).select(this.fields);
            findUsers.push(...findOnEmail);
            console.log(findUsers);
          } else console.log('Email - empty');
        case 'contactPhone':
          if (params.contactPhone) {
            console.log(params.contactPhone);
            const findOnPhone = await this.UserModel.find({
              contactPhone: { $regex: params.contactPhone },
            }).select(this.fields);
            findUsers.push(...findOnPhone);
          } else console.log('contactPhone - empty');
          break;
        default: {
          const findAllUsers = await this.UserModel.find().select(this.fields);
          findUsers.push(...findAllUsers);
          console.log('findUsers from default:');
          console.log(findUsers);
        }
      }
    }
    return findUsers.slice(params.offset, params.offset + params.limit);
  }
}
