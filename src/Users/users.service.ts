/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-useless-catch */
import { HttpException, Injectable } from '@nestjs/common';
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
    this.fields = '_id email name contactPhone role whoCreate';
  }
  /*Метод проверен */
  async create(data: createUserDto): Promise<UserDocument | null> {
    try {
      const userMail = await this.UserModel.findOne({ email: data.email });
      if (userMail) {
        throw new HttpException(
          'Пользователь с таким email уже существует',
          400,
        );
      }
      /* Генерируем простой временный пароль клиента*/
      const password = generate({
        length: 7,
        numbers: true,
        uppercase: true,
        lowercase: true,
        strict: true,
      });
      const hashPass = await bcrypt.hash(password, 10);
      data.passwordHash = hashPass;
      data.whoCreate = 'admin';
      const newUser = new this.UserModel(data);
      await newUser.save();
      return await this.findByEmail(data.email);
    } catch (err) {
      throw err;
    }
  }

  async findById(id: typeId): Promise<UserDocument | null> {
    try {
      const findUser = await this.UserModel.findById(id)
        .select(this.fields)
        .exec();
      if (!findUser) {
        throw new HttpException('Пользователь не найден', 404);
      }
      return findUser;
    } catch (err) {
      throw err;
    }
  }
  /*Метод проверен */
  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      const findUser = await this.UserModel.findOne({ email })
        .select(this.fields)
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
      throw new HttpException('Ни по одному полю совпадений не найдено', 400);
    } else {
      /**
       * return this.UserModel.find(filters)
        .limit(params.limit)
        .skip(params.offset)
        .select(this.fields)
        .exec();
        Так не работает! Выдает пустой массив!!
        Т.К. Один запрос со всеми фильтрами в MongoDB по умолчанию использует логику И.
        Ниже - рабочее решение.
       */
      let value: object;
      for (value of Object.entries(filters)) {
        const found = await this.UserModel.find({ [value[0]]: value[1] })
          .select(this.fields)
          .exec();
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
