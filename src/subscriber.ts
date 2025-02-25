import { ISubscriber } from './types/types';

export class Subscriber implements ISubscriber {
  public constructor(public readonly chatId: number, public readonly username: string) {}
}
