import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import type { createUserDto } from './Interfaces/dto/createUserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly userSRV: UsersService) {}

  @Post()
  create(@Body() body: createUserDto): Promise<UserDocument> {
    return this.userSRV.create(body);
  }
}
