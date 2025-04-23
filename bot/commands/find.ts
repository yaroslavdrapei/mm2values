import TelegramBot, { Message } from 'node-telegram-bot-api';
import { IItem, IMarkdown } from '../../shared/types/types';
import { removeCommandFromMessage, itemToText } from '../../shared/utils/utils';
import { SimpleApiClient } from '../simple-api-client';

export const findCommand = async (
  bot: TelegramBot,
  msg: Message,
  markdown: IMarkdown,
  maxItemsDisplayed: number
): Promise<void> => {
  const chatId = msg.chat.id;

  const name = removeCommandFromMessage(msg.text!).toLowerCase();
  let items = await SimpleApiClient.get<IItem[]>('/items');

  if (!items) {
    bot.sendMessage(chatId, 'Error. Try again later');
    return;
  }

  const messageArr: string[] = [];
  items = items.filter((item) => item.name.toLowerCase().includes(name));

  if (items.length == 0) {
    bot.sendMessage(chatId, `No items found with the name: ${name}`);
    return;
  }

  items.forEach((item) => messageArr.push(itemToText(item, markdown)));

  const totalItemsMsg = `Total items found: ${Math.min(items.length, maxItemsDisplayed)}`;

  const message = messageArr.slice(0, maxItemsDisplayed).join('\n\n') + '\n\n' + totalItemsMsg;

  bot.sendMessage(chatId, message, { parse_mode: markdown.type });
  return;
};
