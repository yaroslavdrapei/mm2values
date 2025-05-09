// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isItem(obj: any): obj is Item {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    typeof obj.value === 'string' &&
    typeof obj.stability === 'string' &&
    typeof obj.demand === 'string' &&
    typeof obj.rarity === 'string' &&
    typeof obj.type === 'string' &&
    (obj.origin === undefined || typeof obj.origin === 'string') &&
    (obj.rangedValue === undefined || typeof obj.rangedValue === 'string') &&
    (obj.lastChangeInValue === undefined || typeof obj.lastChangeInValue === 'string') &&
    (obj.class === undefined || typeof obj.class === 'string') &&
    (obj.contains === undefined || typeof obj.contains === 'string')
  );
}

export type Item = {
  id: string;
  name: string;
  value: string;
  stability: string;
  demand: string;
  rarity: string;
  type: string;
  origin?: string;
  rangedValue?: string;
  lastChangeInValue?: string;
  class?: string;
  contains?: string;
};

export type Report = Partial<{
  [type in ItemType]: ReportName;
}>;

export type ReportName = {
  [name: string]: ReportRecord;
};

export type ReportRecord = {
  [key: string]: {
    old: string;
    new: string;
  };
};

export type Config = {
  frequencyInMinutes: number;
};

export type UpdateLog = {
  report: Report;
  createdAt: Date;
};

export interface IHtmlScraper {
  getChangeLog(): Promise<string | null>;
  getItems(): Promise<Item[] | null>;
}

export type ItemType =
  | 'misc'
  | 'sets'
  | 'pets'
  | 'ancients'
  | 'commons'
  | 'legendaries'
  | 'uniques'
  | 'chromas'
  | 'godlies'
  | 'rares'
  | 'uncommons'
  | 'vintages';
