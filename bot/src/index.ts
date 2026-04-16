import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: Log group IDs
console.log('[BOT] TELEGRAM_DUTY_GROUP_ID:', process.env.TELEGRAM_DUTY_GROUP_ID);
console.log('[BOT] TELEGRAM_PAYMENT_GROUP_ID:', process.env.TELEGRAM_PAYMENT_GROUP_ID);

import { Telegraf, Context } from 'telegraf';
import express from 'express';
import { setupCommands } from './commands';
import { setupMiddleware } from './middleware';
import { setupNotificationEndpoint } from './api';
import { startKeepAlive } from './keepAlive';

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

    // Start keep-alive for Render free tier
    if (process.env.NODE_ENV === 'production') {
      startKeepAlive();
      console.log('✓ Keep-alive started');
    }

    // Graceful shutdown
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();
