import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { InventoryItem } from './inventory-item.schema';

const required = true;

@Schema()
export class Inventory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required })
  user: User;

  @Prop([InventoryItem])
  items: InventoryItem[];

  @Prop({ default: 0 })
  currentValue: number;

  @Prop({ default: 0 })
  lastValue: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

export type InvertoryDocumentOverride = {
  items: Types.DocumentArray<InventoryItem>;
};

export type InventoryDocument = HydratedDocument<Inventory, InvertoryDocumentOverride>;
