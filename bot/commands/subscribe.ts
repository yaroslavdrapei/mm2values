import TelegramBot, { Message } from 'node-telegram-bot-api';
import { ISubscriber } from '../../shared/types/types';
import { SimpleApiClient } from '../simple-api-client';

const isDevMode = process.env.DEV === 'true';

export const subscribeCommand = async (bot: TelegramBot, msg: Message, text: string): Promise<void> => {
  const chatId = msg.chat.id;
  const username = msg.chat.username ?? 'Anonymous user';

  const subscriber = await SimpleApiClient.get<ISubscriber>(`/subscribers/${chatId}`);

  if (!subscriber) {
    const newSubscriber: ISubscriber = { chatId, username };
    console.log(newSubscriber);
    await SimpleApiClient.post<ISubscriber>('/subscribers', newSubscriber);

    bot.sendMessage(chatId, text);

    if (isDevMode) {
      bot.sendMessage(process.env.MY_CHAT_ID!, `Hello, ${username}`);
    }

    return;
  }

  bot.sendMessage(chatId, 'You are already subscribed');
};
