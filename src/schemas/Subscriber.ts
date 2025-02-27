import mongoose from 'mongoose';
import { ISubscriber as MyISubscriber } from '../types/types';

interface ISubscriber extends mongoose.Document, MyISubscriber {}

const subscriberSchema = new mongoose.Schema<ISubscriber>({
  chatId: {
    type: Number,
    required: true
  },
  username: String
});

export const Subscriber = mongoose.model<ISubscriber>('subscribers', subscriberSchema);
