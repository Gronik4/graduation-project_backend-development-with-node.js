import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import type { createUserDto } from './Interfaces/dto/createUserDto';

@Controller('api')
export class UsersController {
  constructor(private readonly userSRV: UsersService) {}

  @Post('/admin/users/')
  create(@Body() body: createUserDto): Promise<Partial<UserDocument> | null> {
    return this.userSRV.create(body);
  }

  @Get('/admin/users/')
  findAllUsers() {}
}
