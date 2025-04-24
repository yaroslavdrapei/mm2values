import { Item } from '../schemas/item';
import { IItem } from '../../shared/types/types';
import { escapeRegExp } from '../../shared/utils/utils';

export class ItemService {
  public getItems = async (query: Record<string, string>): Promise<IItem[]> => {
    const myQuery: Record<string, RegExp> = {};

    if (query.name) myQuery.name = new RegExp(`^${escapeRegExp(query.name)}$`, 'i');
    if (query.type) myQuery.type = new RegExp(`^${escapeRegExp(query.type)}$`, 'i');
    if (query.origin) myQuery.origin = new RegExp(`^${escapeRegExp(query.origin)}$`, 'i');

    return await Item.find(myQuery);
  };

  public getItemById = async (id: string): Promise<IItem | null> => {
    return await Item.findOne({ _id: id });
  };

  public createItem = async (item: IItem): Promise<IItem | null> => {
    return await Item.create(item);
  };

  public updateItem = async (id: string, newItem: IItem): Promise<boolean> => {
    const result = await Item.replaceOne({ _id: id }, newItem);
    return result.modifiedCount > 0;
  };

  public patchItem = async (id: string, newItemProps: Partial<IItem>): Promise<boolean> => {
    const item = await Item.findOne({ _id: id });
    if (!item) return false;

    for (const key of Object.keys(newItemProps)) {
      if (!item.schema.path(key)) continue;
      item.set(key, newItemProps[key] ?? item.get(key));
    }

    // Object.assign(item, newItemProps); // not safe yet

    await item.save();
    return true;
  };

  public deleteItem = async (id: string): Promise<boolean> => {
    const result = await Item.deleteOne({ _id: id });
    return result.deletedCount > 0;
  };
}
