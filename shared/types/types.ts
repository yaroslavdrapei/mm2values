import { Types } from 'mongoose';

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
    typeof obj.type === 'string' &&
    (obj.origin === undefined || typeof obj.origin === 'string') &&
    (obj.rangedValue === undefined || typeof obj.rangedValue === 'string') &&
    (obj.lastChangeInValue === undefined || typeof obj.lastChangeInValue === 'string') &&
    (obj.class === undefined || typeof obj.class === 'string') &&
    (obj.contains === undefined || typeof obj.contains === 'string')
  );
}

export interface IItem {
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
}

export interface IUser {
  chatId: number;
  username?: string;
  subscribed: boolean;
}

export interface ItemEntity extends IItem {
  _id: string;
}

export type Report = {
  [name: string]: ReportRecord;
};

export type ReportRecord = {
  [key: string]: {
    old: string;
    new: string;
  };
};

export interface IMarkdown {
  type: MarkdownType;
  escape(text: string): string;
  bold(text: string): string;
  italic(text: string): string;
  underline(text: string): string;
}

export type MarkdownType = 'HTML' | 'MarkdownV2';

export type BotConfig = {
  frequencyInMinutes: number;
  maxItemsDisplayed: number;
  markdown: MarkdownType;
  commandsText: { [key: string]: string };
};

export type UpdateLog = {
  report: Report;
  createdAt: Date;
  used: boolean;
};

export interface IHtmlScraper {
  getChangeLog(): Promise<string | null>;
  getItems(): Promise<IItem[] | null>;
}

interface IInventoryBase {
  currentValue: number;
  lastValue: number;
  latestChanges: Report;
}

export type InventoryItem = {
  item: Types.ObjectId;
  quantity: number;
};

export type InventoryItemPopulated = {
  item: ItemEntity;
  quantity: number;
};

export interface IInventory extends IInventoryBase {
  owner: Types.ObjectId;
  items: InventoryItem[];
}

export interface IInventoryPopulated extends IInventoryBase {
  owner: IUser;
  items: {
    item: ItemEntity;
    quantity: number;
  }[];
}

export interface InventoryEntity extends IInventoryPopulated {
  _id: string;
}
