import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApikeysService } from './apikeys.service';
import { ParseObjectIdPipe } from '@shared/pipes/parse-object-id.pipe';
import { CreateApikeyDto } from '@shared/dtos/apikeys/create-apikey.dto';
import { Serialize } from '@shared/interceptors/serialize.interceptor';
import { ApikeyDto } from '@shared/dtos/apikeys/apikey.dto';
import { ApikeyGuard } from '@shared/guards/apikey.guard';

@Controller('apikeys')
@Serialize(ApikeyDto)
@UseGuards(ApikeyGuard)
export class ApikeysController {
  constructor(private apikeysService: ApikeysService) {}

  @Post()
  async create(@Body() body: CreateApikeyDto) {
    const apiKey = await this.apikeysService.createKey(body.userId);
    if (!apiKey) {
      throw new BadRequestException("User doesn't exist or they already have a key");
    }
    return apiKey;
  }
}
