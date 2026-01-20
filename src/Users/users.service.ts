import { Injectable } from '@nestjs/common';
/*import { IUserService } from './Interfaces/IUserService';
import { typeId } from './Interfaces/param-id';
import { SearchUserParams } from './Interfaces/SearchUserParams';*/
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
  create(data: createUserDto): Promise<UserDocument> {
    const user = new this.UserModel(data);
    if (!user) {
      throw new Error('Method not implemented.');
    }
    return user.save();
  }
  /*findById(id: typeId): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findAll(params: SearchUserParams): Promise<User[]> {
    throw new Error('Method not implemented.');
  }*/
}
