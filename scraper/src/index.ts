import dotenv from 'dotenv';
dotenv.config();

import config from 'config';
import { update } from './update';
import { HtmlScraper } from './html-scraper';
import { createClient, RedisClientType } from 'redis';

const frequency = config.get<number>('frequencyInMinutes') * 1000 * 60;
const htmlScraper = new HtmlScraper();
const redisClient: RedisClientType = createClient({ url: process.env.REDIS_URL });

const main = async (): Promise<void> => {
  await redisClient.connect();

  await update(redisClient, htmlScraper);

  setInterval(async () => {
    await update(redisClient, htmlScraper);
  }, frequency);
};

main();
