import { Subscriber } from '../schemas/subscriber';
import { ISubscriber } from '../../shared/types/types';

export const getSubscribers = async (): Promise<ISubscriber[]> => {
  return await Subscriber.find();
};

export const getSubscriberByChatId = async (chatId: number): Promise<ISubscriber | null> => {
  return await Subscriber.findOne({ chatId });
};

export const getSubscriberByUsername = async (username: string): Promise<ISubscriber | null> => {
  return await Subscriber.findOne({ username });
};

export const createSubscriber = async (subscriber: ISubscriber): Promise<boolean> => {
  const result = await Subscriber.create(subscriber);
  return !!result;
};

export const deleteSubscriber = async (chatId: number): Promise<boolean> => {
  const result = await Subscriber.deleteOne({ chatId });
  return result.deletedCount > 0;
};
