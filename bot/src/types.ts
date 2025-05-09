// ----------------------------- DTOs for API -----------------------------
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

export type User = {
  id: string;
  chatId: number;
  username?: string;
  subscribed: boolean;
};

export type InventoryItem = {
  item: Item;
  quantity: number;
};

export type Inventory = {
  id: string;
  userId: string;
  items: InventoryItem[];
  currentValue: number;
  lastValue: number;
};

export type ReportDto = {
  report: string;
  createdAt: string;
};

// ----------------------------- Other -----------------------------

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

export interface IMarkdown {
  type: MarkdownType;
  escape(text: string): string;
  bold(text: string): string;
  italic(text: string): string;
  underline(text: string): string;
}

export type MarkdownType = 'HTML' | 'MarkdownV2';

export type Config = {
  frequencyInMinutes: number;
  maxItemsDisplayed: number;
  markdown: MarkdownType;
  commandsText: { [key: string]: string };
};

export type UpdateLog = {
  report: Report;
  createdAt: Date;
};

export type TgItemRequest = {
  quantity: number;
  name: string;
};
