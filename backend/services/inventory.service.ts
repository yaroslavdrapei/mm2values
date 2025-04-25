import { IInventory, IInventoryPopulated, InventoryItem } from '../../shared/types/types';
import { Inventory } from '../schemas/inventory.schema';
import { User } from '../schemas/user.schema';
import { Item } from '../schemas/item.schema';
import { Types } from 'mongoose';

export class InventoryService {
  public async getInventoryById(id: string): Promise<IInventory | null> {
    const inventory = await Inventory.findOne({ _id: id }).populate('items.item').populate('owner');
    if (!inventory) return null;
    return inventory;
  }

  public async getInventoryValue(id: string): Promise<Partial<IInventory> | null> {
    const props = await Inventory.findOne({ _id: id }, { currentValue: 1, lastValue: 1 });
    return props;
  }

  public async createInventory(chatId: number): Promise<IInventory | null> {
    const user = await User.findOne({ chatId });
    if (!user) return null;

    const userId = user._id;
    return await Inventory.create({ owner: userId });
  }

  public async deleteInventory(id: string): Promise<boolean> {
    const result = await Inventory.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  public async patchInventory(id: string, newProps: Partial<IInventory>): Promise<boolean> {
    const inventory = await Inventory.findOne({ _id: id });
    if (!inventory) return false;

    Object.assign(inventory, newProps);
    await inventory.save();
    return true;
  }

  public async addItemToInventory(id: string, body: Record<string, string>): Promise<boolean> {
    const inventory = await Inventory.findOne({ _id: id });
    const item = await Item.findOne({ _id: body.itemId });

    if (!inventory || !item) {
      return false;
    }

    const itemInInventory = this.findItemInInventory(item._id as Types.ObjectId, inventory);

    if (itemInInventory) return false;

    inventory.items.push({
      item: item._id as Types.ObjectId,
      quantity: isNaN(parseInt(body.quantity)) ? 1 : parseInt(body.quantity)
    });

    await inventory.populate('items.item');

    this.calculateTotalValue(inventory as unknown as IInventoryPopulated);

    await inventory.save();
    return true;
  }

  public async changeInventoryItem(id: string, itemId: string, changes: Record<string, string>): Promise<boolean> {
    const inventory = await Inventory.findOne({ _id: id }).populate('items.item');
    const item = await Item.findOne({ _id: itemId });

    if (!inventory || !item) {
      return false;
    }

    const itemInInventory = this.findItemInInventory(item._id as Types.ObjectId, inventory);

    if (!itemInInventory) {
      return false;
    }

    Object.assign(itemInInventory, changes);

    if (itemInInventory.quantity <= 0) {
      this.deleteInventoryItem(itemInInventory, inventory);
    }

    this.calculateTotalValue(inventory as unknown as IInventoryPopulated);

    await inventory.save();
    return true;
  }

  public async recalculateValue(): Promise<void> {
    const inventories = await Inventory.find().populate('items.item');

    inventories.forEach((inventory) => {
      inventory.lastValue = inventory.currentValue;
      this.calculateTotalValue(inventory as unknown as IInventoryPopulated);
    });

    const promises = inventories.map((inv) => inv.save());

    await Promise.all(promises);
  }

  private calculateTotalValue(inventory: IInventoryPopulated): void {
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

  private findItemInInventory(itemId: Types.ObjectId, inventory: IInventory): InventoryItem | null {
    return inventory.items.find((i) => i.item._id.toString() == itemId.toString()) || null;
  }

  private deleteInventoryItem(item: InventoryItem, inventory: IInventory): void {
    const index = inventory.items.indexOf(item);
    inventory.items.splice(index, 1);
  }
}
