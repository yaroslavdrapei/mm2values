import TelegramBot, { Message } from 'node-telegram-bot-api';
import { createOrGetUserInventory } from '../createOrGetUserInventory';
import { IMarkdown, InventoryItem } from '.././types';
import { capitalize } from '.././utils';
import { CATEGORIES } from '../constants';

export const inventoryCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const inventory = await createOrGetUserInventory(bot, msg);
  if (!inventory) {
    bot.sendMessage(chatId, 'Internal problem');
    return;
  }

  const messageArr: string[] = [];
  messageArr.push(markdown.bold('Your inventory:'));
  messageArr.push(`Current value: ${markdown.bold(inventory.currentValue.toString())}`);

  const items: InventoryItem[] = inventory.items;

  CATEGORIES.forEach((category) => {
    const itemsFromCategory = items.filter((item) => item.item.category == category);
    itemsToText(category, markdown, itemsFromCategory, messageArr);
  });

  const itemsNoCategory = items.filter(({ item }) => item.category === '' || item.category === undefined);
  itemsToText('no category', markdown, itemsNoCategory, messageArr);

  bot.sendMessage(chatId, messageArr.join('\n'), { parse_mode: markdown.type });
};

const itemsToText = (category: string, markdown: IMarkdown, items: InventoryItem[], messageArr: string[]): void => {
  if (items.length == 0) return;
  messageArr.push(markdown.bold(`\n----------- ${capitalize(category)} -----------`));

  items.sort((a, b) => {
    const valueA = parseInt(a.item.value.replace(',', ''));
    const valueB = parseInt(b.item.value.replace(',', ''));

    if (isNaN(valueA)) return 1;
    if (isNaN(valueB)) return -1;

    return valueB - valueA;
  });

  items.forEach(({ item, quantity }) => {
    const text = `${markdown.bold(item.name)} (${quantity}): ${capitalize(item.type)}, ${item.value}, ${
      item.stability
    }`;
    messageArr.push(text);
  });
};
