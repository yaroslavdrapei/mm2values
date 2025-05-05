import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Inventory, User } from './types';
import { SimpleApiClient } from './simple-api-client';

export const createOrGetUserInventory = async (bot: TelegramBot, msg: Message): Promise<Inventory | null> => {
  const chatId = msg.chat.id;
  const username = msg.chat.username ?? 'Anonymous user';

  let user = await SimpleApiClient.get<User>(`/users?chatId=${chatId}`);
  if (!user) {
    user = await SimpleApiClient.post<{ chatId: number; username: string }, User>(`/users`, { chatId, username });
    if (!user) {
      bot.sendMessage(chatId, "Couldn't find or create your user profile");
      return null;
    }
  }

  const userId = user.id;
  let inventory = await SimpleApiClient.get<Inventory>(`/inventories?userId=${userId}`);
  if (!inventory) {
    inventory = await SimpleApiClient.post<{ userId: string }, Inventory>(`/inventories`, { userId });
    if (!inventory) {
      bot.sendMessage(chatId, "Couldn't find or create your invertory");
      return null;
    }
  }

  return inventory;
};
