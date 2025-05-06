import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ItemDocument } from './item.schema';

export type SubItemDocument = HydratedDocument<SubItem>;

const required = true;

@Schema({ id: false })
export class SubItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required })
  item: ItemDocument;

  @Prop({ default: 1 })
  quantity: number;
}

export const SubItemSchema = SchemaFactory.createForClass(SubItem);
