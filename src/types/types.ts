export type CommandJson = {
  start: string;
  subscribe: string;
  unsubscribe: string;
  help: string;
};

export interface ISubscriber {
  readonly chatId: number;
  readonly username?: string;
}

export interface IDataFetcher {
  getData(): Promise<string>;
}
