import TelegramBot, { Message } from 'node-telegram-bot-api';

export const startCommand = (bot: TelegramBot, msg: Message, text: string): void => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, text);
};
