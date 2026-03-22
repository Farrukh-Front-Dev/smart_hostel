"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeScheduler = initializeScheduler;
const node_cron_1 = __importDefault(require("node-cron"));
const dutyService_1 = require("../services/dutyService");
const axios_1 = __importDefault(require("axios"));
/**
 * Initialize all scheduled tasks
 */
function initializeScheduler() {
    // Generate duties every day at 08:00
    node_cron_1.default.schedule('0 8 * * *', async () => {
        try {
            console.log('[CRON] Generating duties for today...');
            const today = new Date();
            await dutyService_1.DutyService.generateDutiesForDate(today);
            // Notify bot to post duties
            await notifyBotToDuties();
        }
        catch (error) {
            console.error('[CRON] Error generating duties:', error);
        }
    });
    console.log('✓ Cron jobs initialized');
}
/**
 * Notify bot to post today's duties to Telegram
 */
async function notifyBotToDuties() {
    try {
        const botUrl = process.env.BOT_API_URL || 'http://localhost:3001';
        await axios_1.default.post(`${botUrl}/api/notify/duties`, {
            timestamp: new Date().toISOString(),
        });
        console.log('[CRON] Bot notified to post duties');
    }
    catch (error) {
        console.error('[CRON] Failed to notify bot:', error);
    }
}
//# sourceMappingURL=scheduler.js.map