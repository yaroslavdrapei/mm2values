import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api';
import { Commands } from './commands';
import { HtmlScraper } from './html-scraper';
import { ISubscriber } from './types/types';
import { Subscriber } from './subscriber';
import { Notifier } from './notifier';
import { Db } from './db';

const token = process.env.BOT_TOKEN!;
const url = process.env.SOURCE!;
const commands = Commands.getCommands();

const db = new Db();

const subscribers: ISubscriber[] = db.getSubscribers();

const bot = new TelegramBot(token, { polling: true });
const htmlScraper = new HtmlScraper(url);

const frequency = 1000 * 60 * 5; // 5 minutes

const notifier = new Notifier(htmlScraper, frequency, bot.sendMessage.bind(bot), db);
notifier.start(subscribers);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, commands.start);
});

bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;

  if (!subscribers.find((sub) => sub.chatId === chatId)) {
    const subscriber = new Subscriber(chatId, msg.chat.username!);
    subscribers.push(subscriber);
    db.setSubscribers(subscribers);
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
    db.setSubscribers(subscribers);
    bot.sendMessage(chatId, commands.unsubscribe);
    return;
  }

  bot.sendMessage(chatId, 'You are already unsubscribed');
});

bot.onText(/\/log/, (msg) => {
  const chatId = msg.chat.id;

  try {
    const data = db.getData();
    bot.sendMessage(chatId, data);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Error occurred. Try again later');
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, commands.help);
});

bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;

  const subscriber = subscribers.find((sub) => sub.chatId === chatId);
  if (subscriber) {
    bot.sendMessage(chatId, 'You are subscribed');
    return;
  }

  bot.sendMessage(chatId, 'You are not subscribed');
});
