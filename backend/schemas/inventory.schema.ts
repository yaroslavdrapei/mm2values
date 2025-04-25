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
      _id: false,
      item: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'items'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  currentValue: {
    type: Number,
    default: 0
  },
  lastValue: {
    type: Number,
    default: 0
  },
  latestChanges: {
    type: Object,
    default: {}
  }
});

export const Inventory = mongoose.model<MyIInventory>('inventories', inventorySchema);
