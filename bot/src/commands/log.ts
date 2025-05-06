import TelegramBot, { Message } from 'node-telegram-bot-api';
import { RedisClientType } from 'redis';
import { IMarkdown, UpdateLog } from '.././types';
import { reportToUpdateLog } from '.././utils';

export const logCommand = async (
  bot: TelegramBot,
  msg: Message,
  markdown: IMarkdown,
  redis: RedisClientType
): Promise<void> => {
  const chatId = msg.chat.id;
  const cache = await redis.get('report');

  if (!cache) {
    bot.sendMessage(chatId, 'No data');
    return;
  }

  const updateLog = JSON.parse(cache) as UpdateLog;

  const message = reportToUpdateLog(updateLog.report, markdown);
  bot.sendMessage(chatId, message, { parse_mode: markdown.type });
};
