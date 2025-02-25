import { ISubscriber } from './types/types';

type notifyFunction = (data: string) => void;

export class Subscriber implements ISubscriber {
  public constructor(public readonly chatId: number, public readonly username: string, public notify: notifyFunction) {}
}
