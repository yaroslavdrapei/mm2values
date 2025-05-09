import TelegramBot, { Message } from 'node-telegram-bot-api';
import { IMarkdown, Report, ReportDto } from '.././types';
import { reportToUpdateLog } from '.././utils';
import { SimpleApiClient } from '../simple-api-client';

export const logCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;
  const reportDto = await SimpleApiClient.get<ReportDto>('/reports/latest');

  if (!reportDto) {
    bot.sendMessage(chatId, 'No data');
    return;
  }

  const report = JSON.parse(reportDto?.report) as Report;
  const createdAt = new Date(reportDto.createdAt);

  const message = reportToUpdateLog({ report, createdAt }, markdown);
  bot.sendMessage(chatId, message, { parse_mode: markdown.type });
};
