import dotenv from 'dotenv';
dotenv.config();
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { Commands } from './commands';

const token = process.env.BOT_TOKEN!;
const commands = Commands.getCommands();

const bot = new TelegramBot(token, { polling: true });

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
