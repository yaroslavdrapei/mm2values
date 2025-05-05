import { Controller, Get, Post, Delete, Patch, Body, Param, NotFoundException, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from '@shared/dtos/items/create-item.dto';
import { UpdateItemDto } from '@shared/dtos/items/update-item.dto';
import { Serialize } from '@shared/interceptors/serialize.interceptor';
import { ItemDto } from '@shared/dtos/items/item.dto';
import { GetItemsDto } from '@shared/dtos/items/get-items.dto';
import { ParseObjectIdPipe } from '@shared/pipes/parse-object-id.pipe';

@Controller('items')
@Serialize(ItemDto)
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Get()
  async findAll(@Query() query: GetItemsDto) {
    return await this.itemsService.findAll(query);
  }

  @Get('/:id')
  async findById(@Param('id', ParseObjectIdPipe) id: string) {
    const item = await this.itemsService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with id ${id} was not found`);
    }
    return item;
  }

  @Post()
  async create(@Body() body: CreateItemDto) {
    return await this.itemsService.create(body);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    const item = await this.itemsService.delete(id);
    if (!item) {
      throw new NotFoundException(`Item with id ${id} was not found`);
    }
    return item;
  }

  @Patch('/:id')
  async update(@Param('id', ParseObjectIdPipe) id: string, @Body() body: UpdateItemDto) {
    const item = await this.itemsService.update(id, body);
    if (!item) {
      throw new NotFoundException(`Item with id ${id} was not found`);
    }
    return item;
  }
}
