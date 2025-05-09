import TelegramBot, { Message } from 'node-telegram-bot-api';
import { createOrGetUserInventory } from '../createOrGetUserInventory';
import { IMarkdown, InventoryItem } from '.././types';
import { capitalize } from '.././utils';
import { CATEGORIES, ITEM_TYPES } from '../constants';

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

  const itemsNoCategory = items.filter(
    ({ item }) => item.category === undefined || !CATEGORIES.includes(item.category)
  );
  itemsToText('no category', markdown, itemsNoCategory, messageArr);

  bot.sendMessage(chatId, messageArr.join('\n'), { parse_mode: markdown.type });
};

const itemsToText = (category: string, markdown: IMarkdown, items: InventoryItem[], messageArr: string[]): void => {
  if (items.length == 0) return;
  messageArr.push(markdown.bold(`\n----------- ${capitalize(category)} -----------`));

  items.sort((a, b) => {
    const categoryA = ITEM_TYPES.indexOf(a.item.type);
    const categoryB = ITEM_TYPES.indexOf(b.item.type);

    if (categoryA != categoryB) {
      return categoryA - categoryB;
    }

    return a.item.name.localeCompare(b.item.name);
  });

  items.forEach(({ item, quantity }) => {
    const parsedValue = parseInt(item.value.replace(',', ''));
    const value = isNaN(parsedValue) ? item.value : parsedValue * quantity;
    const text = `${markdown.bold(item.name)} (${quantity}): ${capitalize(item.type)}, ${value}, ${item.stability}`;
    messageArr.push(text);
  });
};
