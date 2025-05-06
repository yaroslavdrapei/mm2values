import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@shared/dtos/users/create-user.dto';
import { UpdateUserDto } from '@shared/dtos/users/update-user.dto';
import { Serialize } from '@shared/interceptors/serialize.interceptor';
import { UserDto } from '@shared/dtos/users/user.dto';
import { GetUserDto } from '@shared/dtos/users/get-user.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ApikeyGuard } from '@shared/guards/apikey.guard';

@Serialize(UserDto)
@UseGuards(ApikeyGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async findByQuery(@Query() query: GetUserDto) {
    const { chatId, username, subscribed } = query;

    if (chatId !== undefined) {
      return this.userService.findByChatId(chatId);
    }

    if (username !== undefined) {
      return this.userService.findByUsername(username);
    }

    if (subscribed !== undefined) {
      return this.userService.findBySubscribedProperty(subscribed);
    }

    return this.userService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id', ParseObjectIdPipe) id: string) {
    const item = await this.userService.findOne(id);
    if (!item) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    return item;
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    const item = await this.userService.delete(id);
    if (!item) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    return item;
  }

  @Patch('/:id')
  async update(@Param('id', ParseObjectIdPipe) id: string, @Body() body: UpdateUserDto) {
    const item = await this.userService.update(id, body);
    if (!item) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }
    return item;
  }
}
