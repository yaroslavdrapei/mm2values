import TelegramBot, { Message } from 'node-telegram-bot-api';
import { SimpleApiClient } from '../simple-api-client';
import { IUser } from '../../shared/types/types';

const isDevMode = process.env.DEV === 'true';

export const unsubscribeCommand = async (bot: TelegramBot, msg: Message, text: string): Promise<void> => {
  const chatId = msg.chat.id;

  const user = await SimpleApiClient.get<IUser>(`/users/${chatId}`);

  if (user) {
    if (!user.subscribed) {
      bot.sendMessage(chatId, 'You are already unsubscribed');
      return;
    }

    await SimpleApiClient.patch(`/users/${chatId}`, { subscribed: false });

    bot.sendMessage(chatId, text);

    if (isDevMode) {
      bot.sendMessage(process.env.MY_CHAT_ID!, `Bye, ${msg.chat.username}`);
    }

    return;
  }

  bot.sendMessage(chatId, 'You are already unsubscribed');
};
