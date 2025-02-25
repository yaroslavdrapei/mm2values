import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api';
import { Commands } from './commands';
import { HtmlScraper } from './html-scraper';
import { ISubscriber } from './types/types';
import { Subscriber } from './subscriber';
import { Notifier } from './notifier';

const token = process.env.BOT_TOKEN!;
const url = process.env.SOURCE!;
const commands = Commands.getCommands();

const bot = new TelegramBot(token, { polling: true });
const htmlScraper = new HtmlScraper(url);

const subscribers: ISubscriber[] = [];

const notifier = new Notifier(htmlScraper, 5000);
notifier.start(subscribers);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, commands.start);
});

bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;

  if (!subscribers.find((sub) => sub.chatId === chatId)) {
    const subscriber = new Subscriber(chatId, msg.chat.username!, bot.sendMessage.bind(bot, chatId));
    subscribers.push(subscriber);
    bot.sendMessage(chatId, commands.subscribe);
    return;
  }

  bot.sendMessage(chatId, 'You are already subscribed');
});

bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;

  const subscriber = subscribers.find((sub) => sub.chatId === chatId);
  if (subscriber) {
    subscribers.splice(subscribers.indexOf(subscriber), 1);
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
