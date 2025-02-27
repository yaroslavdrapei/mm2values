import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Subscriber } from '../schemas/Subscriber';

const isDevMode = process.env.DEV === 'true';

export const unsubscribeCommand = async (bot: TelegramBot, msg: Message, text: string): Promise<void> => {
  const chatId = msg.chat.id;

  const subscriber = await Subscriber.findOne({ chatId });

  if (subscriber) {
    await Subscriber.deleteOne({ chatId });
    bot.sendMessage(chatId, text);

    if (isDevMode) {
      console.log(await Subscriber.find());
      bot.sendMessage(process.env.MY_CHAT_ID!, `Bye, ${msg.chat.username}`);
    }

    return;
  }

  bot.sendMessage(chatId, 'You are already unsubscribed');
};
