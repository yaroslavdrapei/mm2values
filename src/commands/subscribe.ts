import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Subscriber } from '../schemas/Subscriber';

const isDevMode = process.env.DEV === 'true';

export const subscribeCommand = async (bot: TelegramBot, msg: Message, text: string): Promise<void> => {
  const chatId = msg.chat.id;
  const username = msg.chat.username ?? 'Anonymous user';

  const subscriber = await Subscriber.findOne({ chatId });

  if (!subscriber) {
    const newSubscriber = new Subscriber({ chatId, username });
    await newSubscriber.save();

    bot.sendMessage(chatId, text);

    if (isDevMode) {
      console.log(await Subscriber.find());
      bot.sendMessage(process.env.MY_CHAT_ID!, `Hello, ${username}`);
    }

    return;
  }

  bot.sendMessage(chatId, 'You are already subscribed');
};
