import { RedisClientType } from 'redis';
import { IHtmlScraper, Item, ItemType, UpdateLog } from './types';
import { ReportBuilder } from './report-builder';
import got from 'got';
import dotenv from 'dotenv';

dotenv.config();

const httpClient = got.extend({
  prefixUrl: process.env.API_URL,
  headers: {
    authorization: process.env.BACKEND_API_KEY
  },
  retry: {
    limit: 3,
    calculateDelay: () => 3000
  }
});

const findChanges = (oldItem: Item, item: Item): Partial<Item> => {
  const changes: Partial<Item> = {};

  for (const key of Object.keys(item) as (keyof Item)[]) {
    if (item[key] == oldItem[key]) continue;
    changes[key] = item[key];
  }

  return changes;
};

const refreshCache = async (redis: RedisClientType, htmlScraper: IHtmlScraper, changeLog?: string): Promise<void> => {
  const newChangeLog = changeLog ?? (await htmlScraper.getChangeLog()) ?? 'No data';
  await redis.set('data', newChangeLog);
};

export const update = async (redis: RedisClientType, htmlScraper: IHtmlScraper): Promise<void> => {
  const lastChangeLog = await redis.get('data');

  if (!lastChangeLog) {
    await refreshCache(redis, htmlScraper);
    return;
  }

  const newChangeLog = await htmlScraper.getChangeLog();
  if (!newChangeLog) return;

  if (lastChangeLog == newChangeLog) {
    console.log('Not updated;', new Date().toLocaleString('en-GB'));
    return;
  }

  const newItems = await htmlScraper.getItems();
  if (!newItems) return;

  const reportBuilder = new ReportBuilder();

  const oldItems: Item[] = await httpClient.get('items').json();
  const excludedTypes = ['sets'];

  for (const item of newItems) {
    const oldItem = oldItems.find((x) => x.name == item.name && x.type == item.type && x.origin == item.origin);

    if (!oldItem) {
      await httpClient.post(`items`, { json: item });
      continue;
    }

    const changes = findChanges(oldItem, item);

    await httpClient.patch(`items/${oldItem.id}`, { json: changes });

    for (const key of Object.keys(changes) as (keyof Item)[]) {
      if (excludedTypes.includes(item.type)) continue;
      reportBuilder.addOrModifyRecord(item.name, item.type as ItemType, key, oldItem[key], changes[key]);
    }
  }

  const report = reportBuilder.getReport();
  console.log(report, '\n', new Date().toLocaleString('en-GB'));

  if (!reportBuilder.isEmpty()) {
    const updateLog: UpdateLog = { report, createdAt: new Date() };
    await redis.set('report', JSON.stringify(updateLog));
    await httpClient.post('reports', { json: { report: JSON.stringify(updateLog.report) } });
  }

  await httpClient.post(`inventories/recalculate`);

  refreshCache(redis, htmlScraper, newChangeLog);
};
