import mongoose from 'mongoose';
import { IInventory as MyIInventory } from '../../shared/types/types';

interface IInventory extends mongoose.Document, MyIInventory {}

const inventorySchema = new mongoose.Schema<IInventory>({
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users'
  },
  items: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'items'
    }
  ]
});

export const Inventory = mongoose.model<IInventory>('inventories', inventorySchema);
