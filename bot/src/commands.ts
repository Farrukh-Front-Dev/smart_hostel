import { Telegraf, Context } from 'telegraf';
import { CommandHandlers } from './handlers/commandHandlers';
import { CallbackHandlers } from './handlers/callbackHandlers';
import { MessageHandlers } from './handlers/messageHandlers';

/**
 * Setup all bot commands and handlers
 * Clean architecture with separation of concerns
 */
export function setupCommands(bot: Telegraf<Context>): void {
  // Command handlers
  bot.start((ctx) => CommandHandlers.handleStart(ctx));
  bot.help((ctx) => CommandHandlers.handleHelp(ctx));
  bot.command('oplata', (ctx) => CommandHandlers.handleOplata(ctx));
  bot.command('cancel', (ctx) => CommandHandlers.handleCancel(ctx));
  bot.command('today', (ctx) => CommandHandlers.handleToday(ctx));
  bot.command('tomorrow', (ctx) => CommandHandlers.handleTomorrow(ctx));
  bot.command('groupid', (ctx) => CommandHandlers.handleGroupId(ctx));
  bot.command('invite', (ctx) => CommandHandlers.handleInvite(ctx));

  // Callback query handler (inline buttons)
  bot.on('callback_query', (ctx) => CallbackHandlers.handleCallback(ctx, bot));

  // Message handlers
  bot.on('text', (ctx) => MessageHandlers.handleText(ctx));
  bot.on('photo', (ctx) => MessageHandlers.handlePhoto(ctx, bot));
  bot.on('document', (ctx) => MessageHandlers.handleDocument(ctx, bot));
}
