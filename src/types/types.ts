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

export type Subscriber = {
  readonly chatId: number;
  readonly username: string;
};

export const createSubscriber = (chatId: number, username: string): Subscriber => {
  return { chatId, username };
};

export interface IDataFetcher {
  getData(): Promise<string>;
}
