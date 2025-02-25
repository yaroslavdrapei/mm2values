import { Db } from './db';
import { IDataFetcher, Subscriber } from './types/types';

type NotifyFunc = (chatId: number, data: string) => void;

export class Notifier {
  private intervalId: NodeJS.Timeout | null = null;
  private lastData: string = '';
  public constructor(
    private dataFetcher: IDataFetcher,
    private frequency: number,
    private notifyFunc: NotifyFunc,
    private db: Db
  ) {
    this.lastData = this.db.getData();
  }

  public start(subs: Subscriber[]): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.init(subs), this.frequency);
    }
  }

  public stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private async notify(subscribersList: Subscriber[]): Promise<void> {
    subscribersList.forEach((s) => {
      try {
        this.notifyFunc(s.chatId, this.lastData);
      } catch (e) {
        console.log(`Cannot send message to ${s.username}; user has probably blocked the bot`);
        console.error(e);
      }
    });
  }

  private async isDataUpdated(): Promise<boolean> {
    let data: string = '';

    try {
      data = await this.dataFetcher.getData();
    } catch (e) {
      console.log('Caught an error while fetching data:');
      console.error(e);
      data = this.db.getData(); // get the last data stored in the db
    }

    if (data !== this.lastData) {
      this.updateData(data);
      return true;
    }

    return false;
  }

  private async updateData(data: string): Promise<void> {
    this.lastData = data;
    this.db.setData(data);
  }

  private async init(subs: Subscriber[]): Promise<void> {
    const wasDataUpdated = await this.isDataUpdated();

    if (wasDataUpdated) {
      this.notify(subs);

      console.log('Data updated', new Date().toString());
      return;
    }
    console.log('Data not updated', new Date().toString());
  }
}
