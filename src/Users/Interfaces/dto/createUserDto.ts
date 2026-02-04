export interface createUserDto {
  name: string;
  passwordHash: any;
  email: string;
  contactPhone: string;
  role: 'client' | 'admin' | 'manager';
  createAT: 'self' | 'admin';
}
