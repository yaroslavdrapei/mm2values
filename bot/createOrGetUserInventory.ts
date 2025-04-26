import TelegramBot, { Message } from 'node-telegram-bot-api';
import { InventoryEntity, IUser } from '../shared/types/types';
import { SimpleApiClient } from './simple-api-client';

export const createOrGetUserInventory = async (bot: TelegramBot, msg: Message): Promise<InventoryEntity | null> => {
  const chatId = msg.chat.id;
  const username = msg.chat.username ?? 'Anonymous user';

  const inventory = await SimpleApiClient.get<InventoryEntity>(`/inventory?chatId=${chatId}`);

  if (!inventory) {
    const user = await SimpleApiClient.get<IUser>(`/users/${chatId}`);
    if (!user) {
      await SimpleApiClient.post('/users', { chatId, username });
    }
    await SimpleApiClient.post(`/inventory`, { chatId });
  }

  return await SimpleApiClient.get<InventoryEntity>(`/inventory?chatId=${chatId}`);
};
