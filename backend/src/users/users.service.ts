import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@shared/dtos/users/create-user.dto';
import { UpdateUserDto } from '@shared/dtos/users/update-user.dto';
import { User } from '@shared/schemas/user.schema';
import { removeUndefinedProperties } from '@shared/utils/removeUndefinedProperties';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  async findByChatId(chatId: number) {
    return await this.userModel.findOne({ chatId });
  }

  async findByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }

  async findBySubscribedProperty(subscribed: boolean) {
    return await this.userModel.find({ subscribed });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create({ ...createUserDto });
  }

  async update(id: string, update: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) return null;

    const definedUpdate = removeUndefinedProperties(update);

    Object.assign(user, definedUpdate);
    await user.save();
    return user;
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    if (!user) return null;

    await this.userModel.deleteOne({ _id: id });
    return user;
  }
}
