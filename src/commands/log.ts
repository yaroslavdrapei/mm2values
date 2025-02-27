import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Data } from '../schemas/Data';

export const logCommand = async (bot: TelegramBot, msg: Message): Promise<void> => {
  const chatId = msg.chat.id;

  try {
    const data = (await Data.findOne())!.data;
    bot.sendMessage(chatId, data);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Error occurred. Try again later');
  }
};
