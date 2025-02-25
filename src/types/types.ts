export type CommandJson = {
  start: string;
  subscribe: string;
  unsubscribe: string;
  help: string;
};

export type DbSchema = {
  data: string;
  subscribers: string;
};

export interface ISubscriber {
  readonly chatId: number;
  username?: string;
}

export interface IDataFetcher {
  getData(): Promise<string>;
}
