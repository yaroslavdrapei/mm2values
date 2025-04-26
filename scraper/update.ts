import { RedisClientType } from 'redis';
import { IHtmlScraper, IItem, ItemEntity, UpdateLog } from '../shared/types/types';
import { ReportBuilder } from './report-builder';
import axios from 'axios';

const API_URL = process.env.API_URL!;

const refreshCache = async (redis: RedisClientType, htmlScraper: IHtmlScraper, changeLog?: string): Promise<void> => {
  const response = await axios.get(`${API_URL}/items`);
  const items = response.data;

  const newChangeLog = changeLog ?? (await htmlScraper.getChangeLog()) ?? 'No data';

  await redis.set('items', JSON.stringify(items));
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
    console.log('Not updated;', new Date().toString());
    return;
  }

  const newItems = await htmlScraper.getItems();
  if (!newItems) return;

  const reportBuilder = new ReportBuilder();

  const oldItemsCache = await redis.get('items');

  if (!oldItemsCache) {
    refreshCache(redis, htmlScraper);
    return;
  }

  const oldItems: ItemEntity[] = JSON.parse(oldItemsCache);

  for (const item of newItems) {
    const oldItem = oldItems.find((x) => x.name == item.name && x.type == item.type && x.origin == item.origin);

    if (!oldItem) {
      await axios.post(`${API_URL}/items`, item);
      continue;
    }

    for (const key of Object.keys(item) as (keyof IItem)[]) {
      if (item[key] == oldItem[key]) continue;

      reportBuilder.addOrModifyRecord(item.name, key, oldItem[key], item[key]);

      await axios.patch(`${API_URL}/items/${oldItem._id}`, { [key]: item[key] });
    }
  }

  const report = reportBuilder.getReport();
  console.log(report, '\n', new Date().toString());

  if (!reportBuilder.isEmpty()) {
    const updateLog: UpdateLog = { report, createdAt: new Date(), used: false };
    await redis.set('report', JSON.stringify(updateLog));
  }

  await axios.post(`${API_URL}/inventory/recalculate`);

  refreshCache(redis, htmlScraper, newChangeLog);
};
