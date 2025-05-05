import { RedisClientType } from 'redis';
import { IMarkdown, User, UpdateLog } from './types';
import { reportToUpdateLog } from './utils';
import { SimpleApiClient } from './simple-api-client';
import TelegramBot from 'node-telegram-bot-api';

export const notifier = async (bot: TelegramBot, markdown: IMarkdown, redis: RedisClientType): Promise<void> => {
  const data = await redis.get('report');
  if (!data) {
    console.log('No new data', new Date().toString());
    return;
  }

  const updateLog = JSON.parse(data) as UpdateLog;

  if (updateLog.used) {
    console.log('No new data', new Date().toString());
    return;
  }

  console.log('New data!!!', new Date().toString());
  const subscribers = await SimpleApiClient.get<User[]>('/users?subscribed=true');
  if (!subscribers) return; // if list is null it means error, so report is still gonna be fresh

  const message = reportToUpdateLog(updateLog.report, markdown);

  subscribers.forEach((sub) => {
    bot.sendMessage(sub.chatId, message, { parse_mode: markdown.type });
  });

  updateLog.used = true;
  await redis.set('report', JSON.stringify(updateLog));
};
