/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { UserFilters } from './Interfaces/userFilters';

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
  /*Метод проверен */
  async findAll(params: SearchUserParams): Promise<UserDocument[] | string> {
    const filters: UserFilters = {};
    const findUsers: UserDocument[] = [];
    if (params.name) filters.name = { $regex: params.name, $options: 'i' };
    if (params.email) filters.email = { $regex: params.email, $options: 'i' };
    if (params.contactPhone)
      filters.contactPhone = { $regex: params.contactPhone };

    if (Object.keys(filters).length === 0) {
      return 'Ни по одному полю совпадений не найдено';
    } else {
      /**
       * return this.UserModel.find(filters)
        .limit(params.limit)
        .skip(params.offset)
        .select(this.fields)
        .exec();
        Так не работает! Выдает пустой массив!!
        Т.К. Один запрос со всеми фильтрами (MongoDB по умолчанию использует логику И).
       */
      let value: object;
      for (value of Object.entries(filters)) {
        const found = await this.UserModel.find({ [value[0]]: value[1] })
          .select(this.fields)
          .exec();
        console.log(found);
        if (found.length != 0) {
          const merge = found.filter(
            (item2) => !findUsers.some((item1) => item1.email === item2.email),
          );
          findUsers.push(...merge);
        }
      }
      return findUsers.slice(params.offset, params.offset + params.limit);
    }
  }
}
