import { Telegraf, Context } from 'telegraf';

/**
 * Setup bot middleware
 */
export function setupMiddleware(bot: Telegraf<Context>) {
  // Log all messages
  bot.use((ctx, next) => {
    console.log(`[BOT] Message from ${ctx.from?.username || ctx.from?.id}: ${ctx.message?.text || '[media]'}`);
    return next();
  });

  // Error handling
  bot.catch((err, ctx) => {
    console.error('[BOT] Error:', err);
    ctx.reply('❌ An error occurred. Please try again.');
  });
}
