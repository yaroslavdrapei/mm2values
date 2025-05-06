import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Apikey } from '@shared/schemas/apikey.schema';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApikeysService {
  constructor(
    @InjectModel(Apikey.name) private apikeyModel: Model<Apikey>,
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  generateKey() {
    const length = parseInt(this.configService.get<string>('API_KEY_LENGTH')!);
    const bytes = randomBytes(length);
    const key = bytes.toString('hex');
    return key;
  }

  async findKey(userId: string) {
    return await this.apikeyModel.findOne({ user: userId });
  }

  async createKey(userId: string) {
    const existingKey = await this.findKey(userId);
    if (existingKey) return null;

    const key = this.generateKey();
    return await this.apikeyModel.create({ user: userId, key });
  }

  async validateKey(key: string) {
    const apikey = await this.apikeyModel.findOne({ key });
    if (!apikey) return false;

    const userId = apikey.user._id.toString();
    const user = await this.usersService.findOne(userId);

    if (!user) return false;
    return true;
  }
}
