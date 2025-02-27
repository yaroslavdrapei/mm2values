import { Data } from './schemas/Data';
import { Subscriber } from './schemas/Subscriber';
import { IDataFetcher } from './types/types';

type NotifyFunc = (chatId: number, data: string) => void;

export class Notifier {
  private intervalId: NodeJS.Timeout | null = null;
  public constructor(private dataFetcher: IDataFetcher, private frequency: number, private notifyFunc: NotifyFunc) {}

  public async start(): Promise<void> {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.init(), this.frequency);
    }
  }

  public stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private async notify(): Promise<void> {
    const subscribers = await Subscriber.find();
    subscribers.forEach(async (s) => {
      try {
        const data = (await Data.findOne())!.data;
        this.notifyFunc(s.chatId, data);
      } catch (e) {
        console.log(`Cannot send message to ${s.username}; user has probably blocked the bot`);
        console.error(e);
      }
    });
  }

  private async isDataUpdated(): Promise<boolean> {
    let newData: string = '';
    let lastData: string = '';

    try {
      newData = await this.dataFetcher.getData();
      lastData = (await Data.findOne())!.data;
    } catch (e) {
      console.log('Caught an error while fetching data:');
      console.error(e);
      return false;
    }

    if (newData !== lastData) {
      await this.updateData(newData);
      return true;
    }

    return false;
  }

  private async updateData(data: string): Promise<void> {
    const dbData = (await Data.findOne())!;
    dbData.data = data;
    dbData.save();
  }

  private async init(): Promise<void> {
    const wasDataUpdated = await this.isDataUpdated();

    if (wasDataUpdated) {
      this.notify();

      console.log('Data updated', ...new Date().toString().split(' ').slice(0, 5));
      return;
    }
    console.log('Data not updated', ...new Date().toString().split(' ').slice(0, 5));
  }
}
