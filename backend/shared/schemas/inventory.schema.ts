import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { SubItem } from './subitem.schema';

const required = true;

@Schema()
export class Inventory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required })
  user: User;

  @Prop([SubItem])
  items: SubItem[];

  @Prop({ default: 0 })
  currentValue: number;

  @Prop({ default: 0 })
  lastValue: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

export type InvertoryDocumentOverride = {
  items: Types.DocumentArray<SubItem>;
};

export type InventoryDocument = HydratedDocument<Inventory, InvertoryDocumentOverride>;
