import TelegramBot, { Message } from 'node-telegram-bot-api';
import { createOrGetUserInventory } from '../createOrGetUserInventory';
import { SimpleApiClient } from '../simple-api-client';

export const clearCommand = async (bot: TelegramBot, msg: Message): Promise<void> => {
  const chatId = msg.chat.id;

  const inventory = await createOrGetUserInventory(bot, msg);
  if (!inventory) {
    bot.sendMessage(chatId, 'Internal problem');
    return;
  }

  const result = await SimpleApiClient.post(`/inventories/${inventory.id}/clear`, {});
  if (!result) {
    bot.sendMessage(chatId, 'Internal problem. Error to clean inventory');
    return;
  }

  bot.sendMessage(chatId, 'Inventory cleaned successfully');
};
