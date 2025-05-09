import TelegramBot, { Message } from 'node-telegram-bot-api';
import { extractUserRequest, itemToText, queryBuilder, removeCommandFromMessage } from '.././utils';
import { SimpleApiClient } from '../simple-api-client';
import { IMarkdown, Item, User } from '.././types';

export const setCategoryCommand = async (bot: TelegramBot, msg: Message, markdown: IMarkdown): Promise<void> => {
  const chatId = msg.chat.id;

  const user = await SimpleApiClient.get<User>(`users?chatId=${chatId}`);
  if (!user) return;

  const apikey = await SimpleApiClient.get(`apikeys?userId=${user.id}`);
  if (!apikey) return;

  const input = removeCommandFromMessage(msg.text!);
  const inputSplitted = input.split(' ');
  const [itemToChange, category] = [inputSplitted[0], inputSplitted.slice(1).join(' ')];

  if (!itemToChange || !category) {
    bot.sendMessage(chatId, 'Invalid input; Enter item name and category to set');
    return;
  }

  const { name: itemParams } = extractUserRequest(itemToChange);
  const itemParamsSplitted = itemParams.split(':').map((x) => x.trim());

  const [name, type, origin] = itemParamsSplitted;

  if (!name) {
    bot.sendMessage(chatId, `Invalid input for: ${name}`);
    return;
  }

  const query = queryBuilder(name, type, origin);
  const items = await SimpleApiClient.get<Item[]>(`/items${query}`);
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
      `There are more than 1 item with name ${markdown.underline(name)}. Enter your item in format ${markdown.underline(
        name
      )}:type:origin`
    );
    return;
  }

  const itemId = items[0].id;
  const responseItem = await SimpleApiClient.patch<{ category: string }, Item>(`items/${itemId}`, { category });

  if (!responseItem) {
    bot.sendMessage(chatId, 'Smth went wrong. Contact developers if it happens a lot');
    return;
  }

  bot.sendMessage(chatId, `Updated successfully:\n${itemToText(responseItem, markdown)}`, {
    parse_mode: markdown.type
  });
};
