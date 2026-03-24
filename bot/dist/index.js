"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const commands_1 = require("./commands");
const middleware_1 = require("./middleware");
const api_1 = require("./api");
const dutyWorkflow_1 = require("./dutyWorkflow");
dotenv_1.default.config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_PORT = parseInt(process.env.BOT_PORT || '3001');
if (!BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not set');
    process.exit(1);
}
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Setup bot middleware
(0, middleware_1.setupMiddleware)(bot);
// Setup bot commands
(0, commands_1.setupCommands)(bot);
// Setup notification endpoint
(0, api_1.setupNotificationEndpoint)(app, bot);
// Handle text messages (nickname input, confirmation)
bot.on('text', async (ctx) => {
    try {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        const session = (0, dutyWorkflow_1.getActiveSession)(userId);
        const text = ctx.message.text;
        if (session?.step === 'nickname') {
            await (0, dutyWorkflow_1.handleNicknameInput)(ctx, text);
        }
        else if (session?.step === 'confirmation') {
            await (0, dutyWorkflow_1.handleConfirmation)(ctx, text);
        }
        else {
            // Default response
            await ctx.reply(`👋 Hello! Use /start to begin or /help for available commands.`);
        }
    }
    catch (error) {
        console.error('[BOT] Error handling text:', error);
    }
});
// Handle photo uploads (duty reports)
bot.on('photo', async (ctx) => {
    try {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        const session = (0, dutyWorkflow_1.getActiveSession)(userId);
        if (session?.step === 'photos') {
            await (0, dutyWorkflow_1.handlePhotoUpload)(ctx);
        }
        else {
            await ctx.reply(`📸 To submit a duty report, use /start to begin the duty workflow.`);
        }
    }
    catch (error) {
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
    }
    catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
};
startBot();
//# sourceMappingURL=index.js.map