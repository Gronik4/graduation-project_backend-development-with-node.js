/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
/*import { IUserService } from './Interfaces/IUserService';
import { typeId } from './Interfaces/param-id';*/
import { SearchUserParams } from './Interfaces/SearchUserParams';
import { User, UserDocument } from './schemas/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { createUserDto } from './Interfaces/dto/createUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}
  async create(data: createUserDto): Promise<Partial<UserDocument> | null> {
    const user = new this.UserModel(data);
    try {
      await user.save();
      const findUser = await this.UserModel.findById({ _id: user._id })
        .select('_id name email contactPhone role')
        .exec();
      return findUser;
    } catch (err) {
      throw err;
    }
  }
  /*findById(id: typeId): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }*/
  async findAll(params: SearchUserParams): Promise<User[] | string> {
    let findUsers: User[];
    for (const key in params) {
      if (params[key] === 'name') {
        findUsers = await this.UserModel.find((u: { name: string }) =>
          u.name.includes(params.name)),
      }
    }
      
      return findUsers.slice()
  }
}
