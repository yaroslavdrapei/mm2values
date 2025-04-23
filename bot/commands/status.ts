import TelegramBot, { Message } from 'node-telegram-bot-api';
import { SimpleApiClient } from '../simple-api-client';
import { ISubscriber } from '../../shared/types/types';

export const statusCommand = async (bot: TelegramBot, msg: Message): Promise<void> => {
  const chatId = msg.chat.id;

  const subscriber = await SimpleApiClient.get<ISubscriber>(`/subscribers/${chatId}`);

  if (subscriber) {
    bot.sendMessage(chatId, 'You are subscribed');
    return;
  }

  bot.sendMessage(chatId, 'You are not subscribed');
};
