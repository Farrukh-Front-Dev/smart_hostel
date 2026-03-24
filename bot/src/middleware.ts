import { Telegraf, Context } from 'telegraf';

/**
 * Setup bot middleware
 */
export function setupMiddleware(bot: Telegraf<Context>) {
  // Log all messages
  bot.use((ctx, next) => {
    const messageText = ctx.message && 'text' in ctx.message ? ctx.message.text : '[media]';
    console.log(`[BOT] Message from ${ctx.from?.username || ctx.from?.id}: ${messageText}`);
    return next();
  });

  // Error handling
  bot.catch((err, ctx) => {
    console.error('[BOT] Error:', err);
    ctx.reply('❌ An error occurred. Please try again.');
  });
}
