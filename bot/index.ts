import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import TelegramBot from 'node-telegram-bot-api';
import { Commands } from './commands';
import { startCommand } from './commands/start';
import { subscribeCommand } from './commands/subscribe';
import { unsubscribeCommand } from './commands/unsubscribe';
import { logCommand } from './commands/log';
import { helpCommand } from './commands/help';
import { statusCommand } from './commands/status';
import { infoCommand } from './commands/info';
import { findCommand } from './commands/find';
import { notifier } from './notifier';
import { BotConfig } from '../shared/types/types';
import { MarkdownFactory } from './markdown/markdown-factory';
import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({ url: process.env.REDIS_URL! });
redisClient.connect();

const botConfig = config.get<BotConfig>('bot');

const token = process.env.BOT_TOKEN!;
const markdown = MarkdownFactory.create(botConfig.markdown);
const commands = Commands.getCommands();
const frequency = botConfig.frequencyInMinutes * 1000 * 60;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => startCommand(bot, msg, commands.start));
bot.onText(/\/subscribe/, (msg) => subscribeCommand(bot, msg, commands.subscribe));
bot.onText(/\/unsubscribe/, (msg) => unsubscribeCommand(bot, msg, commands.unsubscribe));
bot.onText(/\/log/, (msg) => logCommand(bot, msg, markdown, redisClient));
bot.onText(/\/help/, (msg) => helpCommand(bot, msg, commands.help));
bot.onText(/\/status/, (msg) => statusCommand(bot, msg));
bot.onText(/\/info/, (msg) => infoCommand(bot, msg, markdown));
bot.onText(/\/find/, (msg) => findCommand(bot, msg, markdown, botConfig.maxItemsDisplayed));

notifier(bot, markdown, redisClient);
setInterval(() => notifier(bot, markdown, redisClient), frequency);
