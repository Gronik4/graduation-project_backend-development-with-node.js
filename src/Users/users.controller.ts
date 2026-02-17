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

  @Get('/admin/users/') //Метод проверен
  findAllForAdmin(@Query() params: SearchUserParams) {
    return this.userSRV.findAll(params);
  }

  @Get('/manager/users/') //Метод проверен
  findAllforManager(@Query() params: SearchUserParams) {
    return this.userSRV.findAll(params);
  }
  /**Если сделать так:
   * @Get('/admin/users/')
   * @Get('/manager/users/')
    findAllforManager(@Query() params: SearchUserParams) {
    return this.userSRV.findAll(params);
  }
    Второй роут не работает, так как NestJS не может понять, какой метод использовать для обработки запроса. 
    Поэтому нужно создавать отдельные методы для каждого роута, даже если они выполняют одну и ту же функцию.
    А кроме того это нужно для разграничения доступа по ролям.
   */
}
