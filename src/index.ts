import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api';
import { Commands } from './commands';
import { HtmlScraper } from './html-scraper';

const token = process.env.BOT_TOKEN!;
const url = process.env.SOURCE!;
const commands = Commands.getCommands();

const bot = new TelegramBot(token, { polling: true });
const htmlScraper = new HtmlScraper(url);

const subscribers: number[] = [];

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, commands.start);
});

bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;

  if (!subscribers.includes(chatId)) {
    subscribers.push(chatId);
    bot.sendMessage(chatId, commands.subscribe);
    return;
  }

  bot.sendMessage(chatId, 'You are already subscribed');
});

bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;

  const index = subscribers.indexOf(chatId);
  if (index > -1) {
    subscribers.splice(index, 1);
    bot.sendMessage(chatId, commands.unsubscribe);
    return;
  }

  bot.sendMessage(chatId, 'You are already unsubscribed');
});

bot.onText(/\/log/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const data = await htmlScraper.getData();
    bot.sendMessage(chatId, data);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Error occurred');
  }
});
