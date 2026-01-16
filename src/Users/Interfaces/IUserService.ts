import { User } from '../schemas/user.schema';
import { typeId } from './param-id';
import { SearchUserParams } from './SearchUserParams';

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: typeId): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}
