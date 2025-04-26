import TelegramBot, { Message } from 'node-telegram-bot-api';
import { extractUserRequest, removeCommandFromMessage } from '../../shared/utils/utils';
import { SimpleApiClient } from '../simple-api-client';
import { IMarkdown, ItemEntity } from '../../shared/types/types';
import { queryBuilder } from '../../shared/utils/utils';

export const calcCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const itemsToAdd = removeCommandFromMessage(msg.text!)
    .toLowerCase()
    .split(/[;,]/)
    .map((x) => x.trim());

  let totalValue = 0;

  const messageArr: string[] = [];

  for (const i of itemsToAdd) {
    if (i == '') continue;

    const { quantity, name: itemParams } = extractUserRequest(i);
    const itemParamsSplitted = itemParams.split(':').map((x) => x.trim());

    const [name, type, origin] = itemParamsSplitted;

    if (!name) {
      bot.sendMessage(chatId, `Invalid input for: ${name}`);
      return;
    }

    const query = queryBuilder(name, type, origin);
    const items = await SimpleApiClient.get<ItemEntity[]>(`/items${query}`);
    if (!items) {
      bot.sendMessage(chatId, "Internal problem; Couldn't get items");
      return;
    }

    if (items.length == 0) {
      bot.sendMessage(chatId, `${name} doesn't exist`);
      return;
    }

    if (items.length >= 2) {
      bot.sendMessage(
        chatId,
        `There are more than 1 item with name ${markdown.underline(
          name
        )}. Enter your item in format ${markdown.underline(name)}:type:origin`,
        { parse_mode: markdown.type }
      );
      return;
    }

    const item = items[0];
    const itemValue = parseInt(item.value.replace(',', ''));

    const currentValue = isNaN(itemValue) ? 0 : itemValue * quantity;

    totalValue += currentValue;

    messageArr.push(
      `${item.name} (${quantity}): ${markdown.bold(item.value)} (${currentValue}) ${item.rangedValue}, ${markdown.bold(
        item.stability
      )}`
    );
  }

  messageArr.push(`Total value of the offer: ${markdown.bold(totalValue.toString())}`);
  bot.sendMessage(chatId, messageArr.join('\n'), { parse_mode: markdown.type });
};
