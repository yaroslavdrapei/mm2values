import dotenv from 'dotenv';
dotenv.config();
import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import { Commands } from './commands';
import { HtmlScraper } from './html-scraper';
import { Notifier } from './notifier';
import { startCommand } from './commands/start';
import { subscribeCommand } from './commands/subscribe';
import { unsubscribeCommand } from './commands/unsubscribe';
import { logCommand } from './commands/log';
import { helpCommand } from './commands/help';
import { statusCommand } from './commands/status';
import { infoCommand } from './commands/info';
import { findCommand } from './commands/find';

mongoose.connect(process.env.MONGO_URI!);

const token = process.env.BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

const url = process.env.SOURCE!;
const htmlScraper = new HtmlScraper(url);

const frequency = 1000 * 60 * 5; // 5 minutes
const notifier = new Notifier(htmlScraper, frequency, bot.sendMessage.bind(bot));

const commands = Commands.getCommands();

bot.onText(/\/start/, (msg) => startCommand(bot, msg, commands.start));
bot.onText(/\/subscribe/, (msg) => subscribeCommand(bot, msg, commands.subscribe));
bot.onText(/\/unsubscribe/, (msg) => unsubscribeCommand(bot, msg, commands.unsubscribe));
bot.onText(/\/log/, (msg) => logCommand(bot, msg));
bot.onText(/\/help/, (msg) => helpCommand(bot, msg, commands.help));
bot.onText(/\/status/, (msg) => statusCommand(bot, msg));
bot.onText(/\/info/, (msg) => infoCommand(bot, msg));
bot.onText(/\/find/, (msg) => findCommand(bot, msg));
