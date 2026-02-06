import { typeId } from '../param-id';

export interface createUserDto {
  id?: string | typeId;
  name: string;
  passwordHash: string;
  email: string;
  contactPhone: string;
  role: 'client' | 'admin' | 'manager';
  createAT: 'self' | 'admin';
}
