import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateItemDto } from '@shared/dtos/items/create-item.dto';
import { GetItemsDto } from '@shared/dtos/items/get-items.dto';
import { UpdateItemDto } from '@shared/dtos/items/update-item.dto';
import { Item } from '@shared/schemas/item.schema';
import { removeUndefinedProperties } from '@shared/utils/removeUndefinedProperties';
import { valuesToRegex } from '@shared/utils/valuesToRegex';
import { Model } from 'mongoose';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async findOne(id: string) {
    return await this.itemModel.findOne({ _id: id });
  }

  async findAll(query: GetItemsDto) {
    const validatedQuery = removeUndefinedProperties(query) as Record<string, string>;

    const caseInsensitiveQuery = valuesToRegex(validatedQuery);

    return await this.itemModel.find({ ...caseInsensitiveQuery });
  }

  async create(createItemDto: CreateItemDto) {
    return await this.itemModel.create({ ...createItemDto });
  }

  async update(id: string, update: UpdateItemDto) {
    const item = await this.findOne(id);
    if (!item) return null;

    const definedUpdate = removeUndefinedProperties(update);

    Object.assign(item, definedUpdate);
    await item.save();
    return item;
  }

  async delete(id: string) {
    const item = await this.findOne(id);
    if (!item) return null;

    await this.itemModel.deleteOne({ _id: id });
    return item;
  }
}
