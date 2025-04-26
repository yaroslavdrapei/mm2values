import { Item } from '../schemas/item';
import { IItem } from '../../shared/types/types';

export const getItems = async (): Promise<IItem[]> => {
  return await Item.find();
};

export const getItemsByName = async (name: string): Promise<IItem[]> => {
  return await Item.find({ name });
};

export const createItem = async (item: IItem): Promise<IItem | null> => {
  return await Item.create(item);
};

export const updateItem = async (id: string, newItem: IItem): Promise<boolean> => {
  const result = await Item.replaceOne({ _id: id }, newItem);
  return result.modifiedCount > 0;
};

export const patchItem = async (id: string, newItemProps: Record<string, any>): Promise<boolean> => {
  const item = await Item.findOne({ _id: id });
  if (!item) return false;

  for (const key of Object.keys(newItemProps)) {
    if (!item.schema.path(key)) continue;
    item.set(key, newItemProps[key] ?? item.get(key));
  }

  await item.save();
  return true;
};

export const deleteItem = async (id: string): Promise<boolean> => {
  const result = await Item.deleteOne({ _id: id });
  return result.deletedCount > 0;
};
