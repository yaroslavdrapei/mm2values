import TelegramBot, { Message } from 'node-telegram-bot-api';
import { IUser } from '../../shared/types/types';
import { SimpleApiClient } from '../simple-api-client';

export const subscribeCommand = async (bot: TelegramBot, msg: Message, text: string): Promise<void> => {
  const chatId = msg.chat.id;
  const username = msg.chat.username ?? 'Anonymous user';

  const user = await SimpleApiClient.get<IUser>(`/users/${chatId}`);

  if (!user) {
    await SimpleApiClient.post('/users', { chatId, username, subscribed: true });

    bot.sendMessage(chatId, text);
    return;
  }

  if (user.subscribed) {
    bot.sendMessage(chatId, 'You are already subscribed');
    return;
  }

  await SimpleApiClient.patch(`/users/${chatId}`, { subscribed: true });
  bot.sendMessage(chatId, text);
};
