import TelegramBot, { Message } from 'node-telegram-bot-api';
import { SimpleApiClient } from '../simple-api-client';
import { ISubscriber } from '../../shared/types/types';

const isDevMode = process.env.DEV === 'true';

export const unsubscribeCommand = async (bot: TelegramBot, msg: Message, text: string): Promise<void> => {
  const chatId = msg.chat.id;

  const subscriber = await SimpleApiClient.get<ISubscriber>(`/subscribers/${chatId}`);

  if (subscriber) {
    await SimpleApiClient.delete(`/subscribers/${chatId}`);
    bot.sendMessage(chatId, text);

    if (isDevMode) {
      bot.sendMessage(process.env.MY_CHAT_ID!, `Bye, ${msg.chat.username}`);
    }

    return;
  }

  bot.sendMessage(chatId, 'You are already unsubscribed');
};
