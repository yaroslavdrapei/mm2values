import TelegramBot, { Message } from 'node-telegram-bot-api';
import { IMarkdown, ReportDto } from '.././types';
import { reportToUpdateLog } from '.././utils';
import { SimpleApiClient } from '../simple-api-client';

export const logCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;
  const report = await SimpleApiClient.get<ReportDto>('/reports/latest');

  if (!report) {
    bot.sendMessage(chatId, 'No data');
    return;
  }

  const message = reportToUpdateLog(report, markdown);
  bot.sendMessage(chatId, message, { parse_mode: markdown.type });
};
