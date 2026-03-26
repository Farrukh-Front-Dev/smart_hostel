import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: Log if TELEGRAM_GROUP_ID is loaded
console.log('[BOT] TELEGRAM_GROUP_ID:', process.env.TELEGRAM_GROUP_ID);

import { Telegraf, Context } from 'telegraf';
import express from 'express';
import { setupCommands } from './commands';
import { setupMiddleware } from './middleware';
import { setupNotificationEndpoint } from './api';
import {
  startDutyWorkflow,
  handleNicknameInput,
  handlePhotoUpload,
  handleConfirmation,
  getActiveSession,
} from './dutyWorkflow';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_PORT = parseInt(process.env.BOT_PORT || '3001');

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not set');
  process.exit(1);
}

const bot = new Telegraf<Context>(BOT_TOKEN);
const app = express();

// Middleware
app.use(express.json());

// Setup bot middleware
setupMiddleware(bot);

// Setup bot commands
setupCommands(bot);

// Setup notification endpoint
setupNotificationEndpoint(app, bot);

// Handle text messages (nickname input, confirmation)
bot.on('text', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    const session = getActiveSession(userId);
    const text = ctx.message.text;

    if (session?.step === 'nickname') {
      await handleNicknameInput(ctx, text);
    } else if (session?.step === 'confirmation') {
      await handleConfirmation(ctx, text);
    } else {
      // Default response
      await ctx.reply(
        `👋 Hello! Use /start to begin or /help for available commands.`
      );
    }
  } catch (error) {
    console.error('[BOT] Error handling text:', error);
  }
});

// Handle photo uploads (duty reports)
bot.on('photo', async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    const session = getActiveSession(userId);

    if (session?.step === 'photos') {
      await handlePhotoUpload(ctx);
    } else {
      await ctx.reply(
        `📸 To submit a duty report, use /start to begin the duty workflow.`
      );
    }
  } catch (error) {
    console.error('[BOT] Error handling photo:', error);
    await ctx.reply('❌ Error processing photo. Please try again.');
  }
});

// Start bot
const startBot = async () => {
  try {
    // Start Express server for webhooks
    app.listen(BOT_PORT, () => {
      console.log(`✓ Bot API server running on port ${BOT_PORT}`);
    });

    // Start bot polling
    await bot.launch();
    console.log('✓ Telegram bot started');

    // Graceful shutdown
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();
