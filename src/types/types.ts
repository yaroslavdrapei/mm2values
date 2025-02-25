export type CommandJson = {
  start: string;
  subscribe: string;
  unsubscribe: string;
};

export interface ISubscriber {
  readonly chatId: number;
  username?: string;
  notify(data: string): void;
}

export interface IDataFetcher {
  getData(): Promise<string>;
}
