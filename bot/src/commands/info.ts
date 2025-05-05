import TelegramBot, { Message } from 'node-telegram-bot-api';
import { itemToText, removeCommandFromMessage } from '.././utils';
import { Item, IMarkdown } from '.././types';
import { SimpleApiClient } from '../simple-api-client';

export const infoCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const name = removeCommandFromMessage(msg.text!).toLowerCase();

  // using find because there are items with the same name
  let items = await SimpleApiClient.get<Item[]>('/items');

  if (!items) {
    bot.sendMessage(chatId, 'Error. Try again later');
    return;
  }

  const messageArr: string[] = [];
  items = items.filter((item) => item.name.toLowerCase() == name);

  if (items.length == 0) {
    bot.sendMessage(chatId, `No items found with the name: ${name}`);
    return;
  }

  items.forEach((item) => messageArr.push(itemToText(item, markdown)));
  bot.sendMessage(chatId, messageArr.join('\n\n'), { parse_mode: markdown.type });
};
