"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommands = setupCommands;
const axios_1 = __importDefault(require("axios"));
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
/**
 * Setup bot commands
 */
function setupCommands(bot) {
    // /start command
    bot.start((ctx) => {
        ctx.reply(`👋 Welcome to SmartHostel Bot!\n\n` +
            `Available commands:\n` +
            `/today - View today's duty assignments\n` +
            `/tomorrow - View tomorrow's duty assignments\n` +
            `/report - Submit a duty completion report\n` +
            `/help - Show this message`);
    });
    // /help command
    bot.help((ctx) => {
        ctx.reply(`📋 SmartHostel Commands:\n\n` +
            `/today - View today's duty assignments\n` +
            `/tomorrow - View tomorrow's duty assignments\n` +
            `/report - Submit a duty completion report\n` +
            `/help - Show this message\n\n` +
            `💡 Tip: Send a photo with caption to submit a duty report`);
    });
    // /today command
    bot.command('today', async (ctx) => {
        try {
            const response = await axios_1.default.get(`${BACKEND_URL}/api/duties/today`);
            const duties = response.data;
            let message = `📅 Today's Duty Assignments\n\n`;
            for (const floor in duties.byFloor) {
                const students = duties.byFloor[floor];
                if (students.length > 0) {
                    message += `🏢 Floor ${floor}:\n`;
                    students.forEach((student) => {
                        message += `  • ${student.name} (${student.rollNo})\n`;
                    });
                    message += '\n';
                }
            }
            await ctx.reply(message);
        }
        catch (error) {
            console.error('[BOT] Error fetching today duties:', error.message);
            await ctx.reply('❌ Could not fetch today\'s duties. Please try again later.');
        }
    });
    // /tomorrow command
    bot.command('tomorrow', async (ctx) => {
        try {
            const response = await axios_1.default.get(`${BACKEND_URL}/api/duties/tomorrow`);
            const duties = response.data;
            let message = `📅 Tomorrow's Duty Assignments\n\n`;
            for (const floor in duties.byFloor) {
                const students = duties.byFloor[floor];
                if (students.length > 0) {
                    message += `🏢 Floor ${floor}:\n`;
                    students.forEach((student) => {
                        message += `  • ${student.name} (${student.rollNo})\n`;
                    });
                    message += '\n';
                }
            }
            await ctx.reply(message);
        }
        catch (error) {
            console.error('[BOT] Error fetching tomorrow duties:', error.message);
            await ctx.reply('❌ Could not fetch tomorrow\'s duties. Please try again later.');
        }
    });
    // /report command
    bot.command('report', async (ctx) => {
        await ctx.reply(`📸 To submit a duty report:\n\n` +
            `1. Take a photo of your completed duty\n` +
            `2. Send the photo to this bot\n` +
            `3. Add a caption with any notes (optional)\n\n` +
            `Example caption: "Floor 2 cleaning completed"`);
    });
}
//# sourceMappingURL=commands.js.map