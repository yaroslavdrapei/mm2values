import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const required = true;
const unique = true;

@Schema()
export class User {
  @Prop({ required, unique })
  chatId: number;

  @Prop()
  username: string;

  @Prop({ default: false })
  subscribed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
