import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from '@shared/dtos/inventories/create-inventory.dto';
import { Serialize } from '@shared/interceptors/serialize.interceptor';
import { InventoryDto } from '@shared/dtos/inventories/inventory.dto';
import { AddItemDto } from '@shared/dtos/inventories/add-item.dto';
import { ChangeQuantityDto } from '@shared/dtos/inventories/change-quantity.dto';
import { ParseObjectIdPipe } from '@shared/pipes/parse-object-id.pipe';
import { ApikeyGuard } from '@shared/guards/apikey.guard';

@Controller('inventories')
@Serialize(InventoryDto)
export class InventoriesController {
  constructor(private inventoriesService: InventoriesService) {}

  @Get()
  async findByUserId(@Query('userId', ParseObjectIdPipe) userId: string) {
    const inventory = await this.inventoriesService.findByUserId(userId);
    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${userId} was not found`);
    }
    return inventory;
  }

  @Get('/:id')
  async findById(@Param('id', ParseObjectIdPipe) id: string) {
    const inventory = await this.inventoriesService.findOne(id);
    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${id} was not found`);
    }
    return inventory;
  }

  @UseGuards(ApikeyGuard)
  @Post()
  async create(@Body() body: CreateInventoryDto) {
    const inventory = await this.inventoriesService.create(body);
    if (!inventory) {
      throw new BadRequestException('Not user with provided id');
    }
    return inventory;
  }

  @UseGuards(ApikeyGuard)
  @Delete('/:id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    const inventory = await this.inventoriesService.delete(id);
    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${id} was not found`);
    }
    return inventory;
  }

  @UseGuards(ApikeyGuard)
  @Post('/recalculate')
  async recalculateValuesOfAllInventories() {
    await this.inventoriesService.recalculateValue();
  }

  @UseGuards(ApikeyGuard)
  @Post('/:id/items')
  async addItemToInventory(@Param('id', ParseObjectIdPipe) inventoryId: string, @Body() body: AddItemDto) {
    const inventory = await this.inventoriesService.addItem(inventoryId, body);
    if (!inventory) {
      throw new BadRequestException();
    }
    return inventory;
  }

  @UseGuards(ApikeyGuard)
  @Post('/:id/clear')
  async clearInventory(@Param('id', ParseObjectIdPipe) id: string) {
    const inventory = await this.inventoriesService.clear(id);
    if (!inventory) {
      throw new BadRequestException(`Inventory with id ${id} was not found`);
    }
    return inventory;
  }

  @UseGuards(ApikeyGuard)
  @Patch('/:id/items/:itemId')
  async changeItemQuantity(
    @Param('id', ParseObjectIdPipe) inventoryId: string,
    @Param('itemId') itemId: string,
    @Body() body: ChangeQuantityDto
  ) {
    const inventory = await this.inventoriesService.changeItemQuantity(inventoryId, itemId, body);
    if (!inventory) {
      throw new BadRequestException();
    }
    return inventory;
  }
}
