import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api';
import { Commands } from './commands';

const token = process.env.BOT_TOKEN!;
const commands = Commands.getCommands();

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, commands.start);
});

bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, commands.subscribe);
});

bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, commands.unsubscribe);
});
