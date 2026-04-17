"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from bot .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// Debug: Log group IDs
console.log('[BOT] TELEGRAM_DUTY_GROUP_ID:', process.env.TELEGRAM_DUTY_GROUP_ID);
console.log('[BOT] TELEGRAM_PAYMENT_GROUP_ID:', process.env.TELEGRAM_PAYMENT_GROUP_ID);
const telegraf_1 = require("telegraf");
const express_1 = __importDefault(require("express"));
const commands_1 = require("./commands");
const middleware_1 = require("./middleware");
const api_1 = require("./api");
const keepAlive_1 = require("./keepAlive");
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
            (0, keepAlive_1.startKeepAlive)();
            console.log('✓ Keep-alive started');
        }
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