import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Subscriber } from '../schemas/Subscriber';

export const statusCommand = async (bot: TelegramBot, msg: Message): Promise<void> => {
  const chatId = msg.chat.id;

  const subscriber = await Subscriber.findOne({ chatId });

  if (subscriber) {
    bot.sendMessage(chatId, 'You are subscribed');
    return;
  }

  bot.sendMessage(chatId, 'You are not subscribed');
};
