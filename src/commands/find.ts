import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Item } from '../schemas/Items';
import { escapeRegExp, itemToText, removeCommandForMessage } from '../utils';

const maxItemsDisplayed = 30;

export const findCommand = async (bot: TelegramBot, msg: Message): Promise<void> => {
  const chatId = msg.chat.id;

  const name = removeCommandForMessage(msg.text!);

  const items = await Item.find({ name: { $regex: new RegExp(`${escapeRegExp(name)}`, 'i') } });

  if (items.length) {
    const messageArr: string[] = [];
    items.forEach((item) => messageArr.push(itemToText(item)));

    const totalItemsMsg = `Total items found: ${Math.min(items.length, maxItemsDisplayed)}`;

    bot.sendMessage(chatId, messageArr.slice(0, maxItemsDisplayed).join('\n\n') + '\n\n' + totalItemsMsg, {
      parse_mode: 'HTML'
    });
    return;
  }

  bot.sendMessage(chatId, `No items found with the name: ${name}`);
};
