import TelegramBot, { Message } from 'node-telegram-bot-api';
import { User } from '.././types';
import { SimpleApiClient } from '../simple-api-client';

export const subscribeCommand = async (bot: TelegramBot, msg: Message, text: string): Promise<void> => {
  const chatId = msg.chat.id;
  const username = msg.chat.username ?? 'Anonymous user';

  const user = await SimpleApiClient.get<User>(`/users?chatId=${chatId}`);

  if (!user) {
    await SimpleApiClient.post('/users', { chatId, username, subscribed: true });

    bot.sendMessage(chatId, text);
    return;
  }

  if (user.subscribed) {
    bot.sendMessage(chatId, 'You are already subscribed');
    return;
  }

  await SimpleApiClient.patch(`/users/${user.id}`, { subscribed: true });
  bot.sendMessage(chatId, text);
};
