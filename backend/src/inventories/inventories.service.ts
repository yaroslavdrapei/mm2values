import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AddItemDto } from '@shared/dtos/inventories/add-item.dto';
import { ChangeQuantityDto } from '@shared/dtos/inventories/change-quantity.dto';
import { CreateInventoryDto } from '@shared/dtos/inventories/create-inventory.dto';
import { Inventory } from '@shared/schemas/inventory.schema';
import { InventoryItem } from '@shared/schemas/inventory-item.schema';
import { Model } from 'mongoose';
import { ItemsService } from 'src/items/items.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    private usersService: UsersService,
    private itemsService: ItemsService
  ) {}

  async findOne(id: string) {
    return await this.inventoryModel.findOne({ _id: id }).populate<{ items: InventoryItem[] }>('items.item');
  }

  async findAll() {
    return await this.inventoryModel.find().populate<{ items: InventoryItem[] }>('items.item');
  }

  async findByUserId(userId: string) {
    return await this.inventoryModel.findOne({ user: userId }).populate<{ items: InventoryItem[] }>('items.item');
  }

  async create(createInventoryDto: CreateInventoryDto) {
    const user = await this.usersService.findOne(createInventoryDto.userId);
    if (!user) return null;

    return await this.inventoryModel.create({ user: createInventoryDto.userId });
  }

  async delete(id: string) {
    const inventory = await this.findOne(id);
    if (!inventory) return null;

    await this.inventoryModel.deleteOne({ _id: id });
    return inventory;
  }

  async addItem(id: string, { itemId, quantity }: AddItemDto) {
    const item = await this.itemsService.findOne(itemId);
    if (!item) return null;

    const inventory = await this.findOne(id);
    if (!inventory) return null;

    const inventoryItem: InventoryItem = {
      item,
      quantity: quantity ?? 1
    };

    inventory.items.push(inventoryItem);
    this.calculateTotalValue(inventory);

    await inventory.save();
    return inventory;
  }

  async changeItemQuantity(id: string, itemId: string, { quantity }: ChangeQuantityDto) {
    const inventory = await this.findOne(id);
    if (!inventory) return null;

    const inventoryItem = inventory.items.find((x) => x.item._id.toString() == itemId);
    if (!inventoryItem) return null;

    inventoryItem.quantity = quantity;

    if (inventoryItem.quantity <= 0) {
      this.removeItem(inventoryItem, inventory);
    }

    this.calculateTotalValue(inventory);
    await inventory.save();
    return inventory;
  }

  async recalculateValue() {
    const inventories = await this.findAll();

    inventories.forEach((inventory) => {
      inventory.lastValue = inventory.currentValue;
      this.calculateTotalValue(inventory);
    });

    const promises = inventories.map((inv) => inv.save());

    await Promise.all(promises);
  }

  async clear(id: string) {
    const inventory = await this.findOne(id);
    if (!inventory) return null;

    inventory.items = [];
    inventory.currentValue = 0;

    await inventory.save();
    return inventory;
  }

  private removeItem(item: InventoryItem, inventory: Inventory): void {
    const index = inventory.items.indexOf(item);
    inventory.items.splice(index, 1);
  }

  private calculateTotalValue(inventory: Inventory) {
    const items = inventory.items;

    let newInventoryValue = 0;

    items.forEach((item) => {
      const itemValue = parseInt(item.item.value.replace(',', ''));
      if (isNaN(itemValue)) {
        return;
      }

      newInventoryValue += itemValue * item.quantity;
    });

    inventory.currentValue = newInventoryValue;
  }
}
