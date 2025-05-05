import TelegramBot, { Message } from 'node-telegram-bot-api';
import { createOrGetUserInventory } from '../createOrGetUserInventory';
import { IMarkdown } from '.././types';

export const profitCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const inventory = await createOrGetUserInventory(bot, msg);
  if (!inventory) {
    bot.sendMessage(chatId, 'Internal problem');
    return;
  }

  const { currentValue, lastValue } = inventory;
  const profit = currentValue - lastValue;

  bot.sendMessage(
    chatId,
    `Before value changes: ${markdown.bold(lastValue.toString())}\nAfter value changes: ${markdown.bold(
      currentValue.toString()
    )}\nProfit: ${markdown.bold(profit.toString())}`,
    { parse_mode: markdown.type }
  );
};
