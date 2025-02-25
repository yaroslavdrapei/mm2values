import { IDataFetcher, ISubscriber } from './types/types';

export class Notifier {
  private intervalId: NodeJS.Timeout | null = null;
  private lastData: string = '';
  public constructor(private dataFetcher: IDataFetcher, private frequency: number) {}

  public start(subs: ISubscriber[]): void {
    if (!this.intervalId) {
      this.intervalId = setInterval(async () => {
        if (await this.isDataUpdated()) {
          this.notify(subs);
          console.log('Data updated');
          return;
        }
        console.log('Data not updated');
      }, this.frequency);
    }
  }

  public stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private async notify(subscribersList: ISubscriber[]): Promise<void> {
    subscribersList.forEach((s) => s.notify(this.lastData));
  }

  private async isDataUpdated(): Promise<boolean> {
    const data = await this.dataFetcher.getData();

    if (data !== this.lastData) {
      this.lastData = data;
      return true;
    }

    return false;
  }
}
