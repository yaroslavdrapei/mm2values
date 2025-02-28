import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Item } from '../schemas/Items';
import { escapeRegExp, itemToText, removeCommandForMessage } from '../utils';

export const infoCommand = async (bot: TelegramBot, msg: Message): Promise<void> => {
  const chatId = msg.chat.id;

  const name = removeCommandForMessage(msg.text!);

  // using find because there are items with the same name
  const items = await Item.find({ name: { $regex: new RegExp(`^${escapeRegExp(name)}$`, 'i') } });

  if (items.length) {
    const messageArr: string[] = [];
    items.forEach((item) => messageArr.push(itemToText(item)));

    bot.sendMessage(chatId, messageArr.join('\n\n'), { parse_mode: 'HTML' });
    return;
  }

  bot.sendMessage(chatId, `No items found with the name: ${name}`);
};
