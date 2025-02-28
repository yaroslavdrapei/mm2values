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

export type DefaultObject = {
  [key: string]: string;
};

export interface IItem {
  name: string;
  value: string;
  stability: string;
  demand: string;
  rarity: string;
  origin?: string;
  rangedValue?: string;
  lastChangeInValue?: string;
  class?: string;
  contains?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isIItem(obj: any): obj is IItem {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    typeof obj.value === 'string' &&
    typeof obj.stability === 'string' &&
    typeof obj.demand === 'string' &&
    typeof obj.rarity === 'string' &&
    (obj.origin === undefined || typeof obj.origin === 'string') &&
    (obj.rangedValue === undefined || typeof obj.rangedValue === 'string') &&
    (obj.lastChangeInValue === undefined || typeof obj.lastChangeInValue === 'string') &&
    (obj.class === undefined || typeof obj.class === 'string') &&
    (obj.contains === undefined || typeof obj.contains === 'string')
  );
}
