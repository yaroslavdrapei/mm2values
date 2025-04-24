import TelegramBot, { Message } from 'node-telegram-bot-api';
import { SimpleApiClient } from '../simple-api-client';
import { IUser } from '../../shared/types/types';

export const statusCommand = async (bot: TelegramBot, msg: Message): Promise<void> => {
  const chatId = msg.chat.id;

  const user = await SimpleApiClient.get<IUser>(`/users/${chatId}`);

  if (user?.subscribed) {
    bot.sendMessage(chatId, 'You are subscribed');
    return;
  }

  bot.sendMessage(chatId, 'You are not subscribed');
};
