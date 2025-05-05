import TelegramBot, { Message } from 'node-telegram-bot-api';
import { capitalize, extractUserRequest, removeCommandFromMessage } from '.././utils';
import { SimpleApiClient } from '../simple-api-client';
import { IMarkdown, Item } from '.././types';
import { createOrGetUserInventory } from '../createOrGetUserInventory';
import { queryBuilder } from '.././utils';

export const addCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const inventory = await createOrGetUserInventory(bot, msg);
  if (!inventory) {
    bot.sendMessage(chatId, "Internal problem; Couldn't get inventory");
    return;
  }

  const itemsToAdd = removeCommandFromMessage(msg.text!)
    .toLowerCase()
    .split(/[;,]/)
    .map((x) => x.trim());

  const messageArr: string[] = [];

  for (const i of itemsToAdd) {
    if (i == '') continue;

    const { quantity, name: itemParams } = extractUserRequest(i);
    const itemParamsSplitted = itemParams.split(':').map((x) => x.trim());

    const [name, type, origin] = itemParamsSplitted;

    if (!name) {
      messageArr.push(`Invalid input for: ${name}`);
      continue;
    }

    const query = queryBuilder(name, type, origin);
    const items = await SimpleApiClient.get<Item[]>(`/items${query}`);
    if (!items) {
      bot.sendMessage(chatId, "Internal problem; Couldn't get items");
      return;
    }

    if (items.length == 0) {
      messageArr.push(`${name} doesn't exist`);
      continue;
    }

    if (items.length >= 2) {
      messageArr.push(
        `There are more than 1 item with name ${markdown.underline(
          name
        )}. Enter your item in format ${markdown.underline(name)}:type:origin`
      );
      continue;
    }

    const itemId = items![0].id;

    const item = inventory.items.find((item) => item.item.id == itemId);

    if (item) {
      await SimpleApiClient.patch(`/inventories/${inventory.id}/items/${itemId}`, {
        quantity: item.quantity + quantity
      });
    } else {
      await SimpleApiClient.post(`/inventories/${inventory.id}/items`, {
        itemId,
        quantity
      });
    }

    messageArr.push(`${capitalize(name)} (${quantity}) added successfully`);
  }

  const values = await SimpleApiClient.get<{ currentValue: number }>(`/inventories/${inventory.id}`);
  messageArr.push(`Total value: ${values ? values.currentValue : null}`);
  bot.sendMessage(chatId, messageArr.join('\n'), { parse_mode: markdown.type });
};
