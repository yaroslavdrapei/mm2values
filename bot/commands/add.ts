import TelegramBot, { Message } from 'node-telegram-bot-api';
import { capitalize, removeCommandFromMessage } from '../../shared/utils/utils';
import { SimpleApiClient } from '../simple-api-client';
import { IMarkdown, ItemEntity } from '../../shared/types/types';
import { createOrGetUserInventory } from '../createOrGetUserInventory';
import { queryBuilder } from '../../shared/utils/utils';

export const addCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const itemsToAdd = removeCommandFromMessage(msg.text!)
    .toLowerCase()
    .split(';')
    .map((x) => x.trim());

  const messageArr: string[] = [];

  for (const i of itemsToAdd) {
    if (i == '') continue;

    const text = i;
    const [quantitySplit, ...itemParams] = text.split(' ');

    const quantity = isNaN(parseInt(quantitySplit)) ? 1 : parseInt(quantitySplit);
    const itemParamsSplitted = itemParams
      .join(' ')
      .split(':')
      .map((x) => x.trim());

    const [name, type, origin] = itemParamsSplitted;

    if (!name || !quantity) {
      messageArr.push(`Invalid input for: ${name}`);
      continue;
    }

    const inventory = await createOrGetUserInventory(bot, msg);
    if (!inventory) {
      bot.sendMessage(chatId, "Internal problem; Couldn't get inventory");
      return;
    }

    const query = queryBuilder(name, type, origin);
    const items = await SimpleApiClient.get<ItemEntity[]>(`/items${query}`);
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

    const itemId = items![0]._id;

    const item = inventory.items.find((item) => item.item._id == itemId);

    if (item) {
      await SimpleApiClient.patch(`/inventory/${inventory._id}/items/${itemId}`, {
        quantity: item.quantity + quantity
      });
    } else {
      await SimpleApiClient.post(`/inventory/${inventory._id}/items`, {
        itemId,
        quantity
      });
    }

    messageArr.push(`${capitalize(name)} (${quantity}) added successfully`);
  }

  bot.sendMessage(chatId, messageArr.join('\n'), { parse_mode: markdown.type });
};
