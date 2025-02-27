import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api';
import { Commands } from './commands';
import { HtmlScraper } from './html-scraper';
import { Notifier } from './notifier';
import mongoose from 'mongoose';
import { Subscriber } from './schemas/Subscriber';
import { Data } from './schemas/Data';

const isDevMode = process.env.DEV === 'true';
const token = process.env.BOT_TOKEN!;
const url = process.env.SOURCE!;
const commands = Commands.getCommands();

mongoose.connect(process.env.MONGO_URI!);

const bot = new TelegramBot(token, { polling: true });
const htmlScraper = new HtmlScraper(url);

const frequency = 1000 * 60 * 5; // 5 minutes

const notifier = new Notifier(htmlScraper, frequency, bot.sendMessage.bind(bot));

Data.findOne().then((data) => {
  if (!data) {
    Data.create({ data: 'init value' }).then(() => notifier.start());
    return;
  }

  notifier.start();
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, commands.start);
});

bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username ?? 'Anonymous user';

  const subscriber = await Subscriber.findOne({ chatId });

  if (!subscriber) {
    const newSubscriber = new Subscriber({ chatId, username });
    await newSubscriber.save();

    bot.sendMessage(chatId, commands.subscribe);

    if (isDevMode) {
      console.log(await Subscriber.find());
      bot.sendMessage(process.env.MY_CHAT_ID!, `Hello, ${username}`);
    }

    return;
  }

  bot.sendMessage(chatId, 'You are already subscribed');
});

bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;

  const subscriber = await Subscriber.findOne({ chatId });

  if (subscriber) {
    await Subscriber.deleteOne({ chatId });
    bot.sendMessage(chatId, commands.unsubscribe);

    if (isDevMode) {
      console.log(await Subscriber.find());
      bot.sendMessage(process.env.MY_CHAT_ID!, `Bye, ${msg.chat.username}`);
    }

    return;
  }

  bot.sendMessage(chatId, 'You are already unsubscribed');
});

bot.onText(/\/log/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const data = (await Data.findOne())!.data;
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

bot.onText(/\/status/, async (msg) => {
  const chatId = msg.chat.id;

  const subscriber = await Subscriber.findOne({ chatId });

  if (subscriber) {
    bot.sendMessage(chatId, 'You are subscribed');
    return;
  }

  bot.sendMessage(chatId, 'You are not subscribed');
});
