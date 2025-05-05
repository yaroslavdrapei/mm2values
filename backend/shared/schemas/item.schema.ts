import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

const required = true;

@Schema()
export class Item {
  @Prop({ required })
  name: string;

  @Prop({ required })
  value: string;

  @Prop({ required })
  stability: string;

  @Prop({ required })
  demand: string;

  @Prop({ required })
  rarity: string;

  @Prop({ required })
  type: string;

  @Prop()
  origin: string;

  @Prop()
  rangedValue: string;

  @Prop()
  lastChangeInValue: string;

  @Prop()
  class: string;

  @Prop()
  contains: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
