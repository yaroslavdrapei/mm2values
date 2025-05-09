import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ItemDocument } from './item.schema';

export type InventoryItemDocument = HydratedDocument<InventoryItem>;

const required = true;

@Schema({ _id: false })
export class InventoryItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required })
  item: ItemDocument;

  @Prop({ default: 1 })
  quantity: number;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);
