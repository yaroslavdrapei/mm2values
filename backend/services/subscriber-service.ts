import { Subscriber } from '../schemas/subscriber';
import { ISubscriber } from '../../shared/types/types';

export class SubscriberService {
  public getSubscribers = async (): Promise<ISubscriber[]> => {
    return await Subscriber.find();
  };

  public getSubscriberByChatId = async (chatId: number): Promise<ISubscriber | null> => {
    return await Subscriber.findOne({ chatId });
  };

  public getSubscriberByUsername = async (username: string): Promise<ISubscriber | null> => {
    return await Subscriber.findOne({ username });
  };

  public createSubscriber = async (subscriber: ISubscriber): Promise<boolean> => {
    const result = await Subscriber.create(subscriber);
    return !!result;
  };

  public deleteSubscriber = async (chatId: number): Promise<boolean> => {
    const result = await Subscriber.deleteOne({ chatId });
    return result.deletedCount > 0;
  };
}
