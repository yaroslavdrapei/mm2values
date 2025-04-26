import TelegramBot, { Message } from 'node-telegram-bot-api';
import { createOrGetUserInventory } from '../createOrGetUserInventory';
import { IMarkdown, InventoryItemPopulated } from '../../shared/types/types';
import { capitalize } from '../../shared/utils/utils';

export const inventoryCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const inventory = await createOrGetUserInventory(bot, msg);
  if (!inventory) {
    bot.sendMessage(chatId, 'Internal problem');
    return;
  }

  const items: InventoryItemPopulated[] = inventory.items;
  items.sort((a, b) => {
    const valueA = parseInt(a.item.value.replace(',', ''));
    const valueB = parseInt(b.item.value.replace(',', ''));

    if (isNaN(valueA)) return 1;
    if (isNaN(valueB)) return -1;

    return valueB - valueA;
  });

  const messageArr: string[] = [];
  messageArr.push(markdown.bold('Your inventory:'));
  messageArr.push(`Current value: ${markdown.bold(inventory.currentValue.toString())}`);
  messageArr.push(markdown.bold('\nItems:'));
  items.forEach(({ item, quantity }) => {
    const text = `${markdown.bold(item.name)} (${quantity}): ${capitalize(item.type)}, ${item.value}, ${
      item.stability
    }`;
    messageArr.push(text);
  });

  bot.sendMessage(chatId, messageArr.join('\n'), { parse_mode: markdown.type });
};
