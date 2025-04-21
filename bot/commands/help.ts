import TelegramBot, { Message } from 'node-telegram-bot-api';

export const helpCommand = async (bot: TelegramBot, msg: Message, text: string): Promise<void> => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, text);
};
