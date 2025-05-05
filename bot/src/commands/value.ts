import TelegramBot, { Message } from 'node-telegram-bot-api';
import { IMarkdown } from '.././types';
import { createOrGetUserInventory } from '../createOrGetUserInventory';

export const valueCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const inventory = await createOrGetUserInventory(bot, msg);
  if (!inventory) {
    bot.sendMessage(chatId, 'Internal problem');
    return;
  }

  bot.sendMessage(chatId, `Total value: ${markdown.bold(inventory.currentValue.toString())}`, {
    parse_mode: markdown.type
  });
};
