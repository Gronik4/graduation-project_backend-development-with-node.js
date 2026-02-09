import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import type { createUserDto } from './Interfaces/dto/createUserDto';
import type { SearchUserParams } from './Interfaces/SearchUserParams';

@Controller('api')
export class UsersController {
  constructor(private readonly userSRV: UsersService) {}

  @Post('/admin/users/')
  create(@Body() body: createUserDto): Promise<Partial<UserDocument> | null> {
    return this.userSRV.create(body);
  }

  @Get('/admin/users/')
  @Get('/manager/users/')
  findAllUsers(@Query() params: SearchUserParams) {
    return this.userSRV.findAll(params);
  }
}
