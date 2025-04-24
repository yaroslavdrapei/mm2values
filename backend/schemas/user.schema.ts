import mongoose from 'mongoose';
import { IUser as MyIUser } from '../../shared/types/types';

interface IUser extends mongoose.Document, MyIUser {}

const userSchema = new mongoose.Schema<IUser>({
  chatId: {
    type: Number,
    required: true
  },
  username: String,
  subscribed: {
    type: Boolean,
    default: false
  }
});

export const User = mongoose.model<IUser>('users', userSchema);
