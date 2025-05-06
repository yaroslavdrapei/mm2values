import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from './user.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type ApikeyDocument = HydratedDocument<Apikey>;

@Schema()
export class Apikey {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  user: UserDocument;

  @Prop({ required: true })
  key: string;
}

export const ApikeySchema = SchemaFactory.createForClass(Apikey);
