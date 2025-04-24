import mongoose from 'mongoose';
import { IItem as MyIItem } from '../../shared/types/types';

interface IItem extends mongoose.Document, MyIItem {}

const itemSchema = new mongoose.Schema<IItem>({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  stability: {
    type: String,
    required: true
  },
  demand: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  origin: String,
  rangedValue: String,
  lastChangeInValue: String,
  class: String,
  contains: String
});

export const Item = mongoose.model<IItem>('items', itemSchema);
