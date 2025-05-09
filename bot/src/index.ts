import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import TelegramBot from 'node-telegram-bot-api';
import { startCommand } from './commands/start';
import { subscribeCommand } from './commands/subscribe';
import { unsubscribeCommand } from './commands/unsubscribe';
import { logCommand } from './commands/log';
import { helpCommand } from './commands/help';
import { statusCommand } from './commands/status';
import { infoCommand } from './commands/info';
import { findCommand } from './commands/find';
import { notifier } from './notifier';
import { Config } from './types';
import { MarkdownFactory } from './markdown/markdown-factory';
import { createClient, RedisClientType } from 'redis';
import { addCommand } from './commands/add';
import { inventoryCommand } from './commands/inventory';
import { removeCommand } from './commands/remove';
import { valueCommand } from './commands/value';
import { profitCommand } from './commands/profit';
import { calcCommand } from './commands/calc';
import { clearCommand } from './commands/clear';

const redisClient: RedisClientType = createClient({ url: process.env.REDIS_URL! });
redisClient.connect();

const botConfig = config.get<Config>('config');

const token = process.env.BOT_TOKEN!;
const markdown = MarkdownFactory.create(botConfig.markdown);
const commands = botConfig.commandsText;
const frequency = botConfig.frequencyInMinutes * 1000 * 60;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => startCommand(bot, msg, commands.start));
bot.onText(/\/subscribe/, (msg) => subscribeCommand(bot, msg, commands.subscribe));
bot.onText(/\/unsubscribe/, (msg) => unsubscribeCommand(bot, msg, commands.unsubscribe));
bot.onText(/\/log/, (msg) => logCommand(bot, msg, markdown));
bot.onText(/\/help/, (msg) => helpCommand(bot, msg, commands.help));
bot.onText(/\/status/, (msg) => statusCommand(bot, msg));
bot.onText(/\/info/, (msg) => infoCommand(bot, msg, markdown));
bot.onText(/\/find/, (msg) => findCommand(bot, msg, markdown, botConfig.maxItemsDisplayed));
bot.onText(/\/add/, (msg) => addCommand(bot, msg, markdown));
bot.onText(/\/remove/, (msg) => removeCommand(bot, msg, markdown));
bot.onText(/\/(inv|inventory)/, (msg) => inventoryCommand(bot, msg, markdown));
bot.onText(/\/value/, (msg) => valueCommand(bot, msg, markdown));
bot.onText(/\/profit/, (msg) => profitCommand(bot, msg, markdown));
bot.onText(/\/calc/, (msg) => calcCommand(bot, msg, markdown));
bot.onText(/\/clear/, (msg) => clearCommand(bot, msg));

notifier(bot, markdown, redisClient);
setInterval(() => notifier(bot, markdown, redisClient), frequency);
