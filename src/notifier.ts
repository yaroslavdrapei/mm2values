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
      this.intervalId = setInterval(async () => {
        if (await this.isDataUpdated()) {
          this.notify(subs);
          console.log('Data updated', new Date().toString());
          return;
        }
        console.log('Data not updated', new Date().toString());
      }, this.frequency);
    }
  }

  public stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private async notify(subscribersList: Subscriber[]): Promise<void> {
    subscribersList.forEach((s) => this.notifyFunc(s.chatId, this.lastData));
  }

  private async isDataUpdated(): Promise<boolean> {
    let data: string = '';

    try {
      data = await this.dataFetcher.getData();
    } catch (e) {
      console.log('Caught an error while fetching data:');
      console.error(e);
      data = this.db.getData();
    }

    if (data !== this.lastData) {
      this.lastData = data;
      this.db.setData(data);
      return true;
    }

    return false;
  }
}
