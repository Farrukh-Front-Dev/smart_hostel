"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlers = void 0;
const keyboard_1 = require("../utils/keyboard");
const messages_1 = require("../utils/messages");
const stateManager_1 = require("../services/stateManager");
const messageTracker_1 = require("../services/messageTracker");
const constants_1 = require("../config/constants");
const date_1 = require("../utils/date");
class CommandHandlers {
    static async handleStart(ctx) {
        await ctx.reply(messages_1.MESSAGES.WELCOME, {
            reply_markup: (0, keyboard_1.getMainKeyboard)()
        });
    }
    static async handleHelp(ctx) {
        await ctx.reply(messages_1.MESSAGES.HELP, {
            reply_markup: (0, keyboard_1.getMainKeyboard)()
        });
    }
    static async handleOplata(ctx) {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        try {
            // Clean up previous operation messages
            await messageTracker_1.MessageTracker.cleanup(ctx, userId);
            stateManager_1.StateManager.set(userId, {
                step: constants_1.PAYMENT_STEPS.WAITING_FOR_NICK,
                data: { month: (0, date_1.getCurrentMonth)(), messageIds: [] }
            });
            const msg = await ctx.reply(messages_1.MESSAGES.PAYMENT_START);
            messageTracker_1.MessageTracker.trackBotMessage(userId, msg.message_id);
            const state = stateManager_1.StateManager.get(userId);
            if (state) {
                state.data.messageIds = [msg.message_id];
                stateManager_1.StateManager.set(userId, state);
            }
        }
        catch (error) {
            console.error('[CommandHandlers] Error starting payment:', error.message);
            await ctx.reply(messages_1.MESSAGES.ERROR);
        }
    }
    static async handleCancel(ctx) {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        if (stateManager_1.StateManager.has(userId)) {
            stateManager_1.StateManager.delete(userId);
            // Clean up all tracked messages
            await messageTracker_1.MessageTracker.cleanup(ctx, userId);
            await ctx.reply(messages_1.MESSAGES.PAYMENT_CANCELLED, {
                reply_markup: (0, keyboard_1.getMainKeyboard)()
            });
        }
        else {
            await ctx.reply(messages_1.MESSAGES.NO_ACTIVE_OPERATION);
        }
    }
    static async handleToday(ctx) {
        // Handled in callbackHandlers for consistency
    }
    static async handleTomorrow(ctx) {
        // Handled in callbackHandlers for consistency
    }
    static async handleGroupId(ctx) {
        const chatId = ctx.chat?.id;
        const chatType = ctx.chat?.type;
        const chatTitle = ctx.chat?.title || 'Private Chat';
        await ctx.reply(`📍 Chat Information:\n\n` +
            `Chat ID: <code>${chatId}</code>\n` +
            `Chat Type: ${chatType}\n` +
            `Chat Name: ${chatTitle}\n\n` +
            `Use this ID in your bot configuration.`, { parse_mode: 'HTML' });
    }
    static async handleInvite(ctx) {
        const bot = ctx.telegram;
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;
        const inviteLink = `https://t.me/${botUsername}`;
        await ctx.reply(`🔗 Bot Invite Link:\n\n` +
            `<a href="${inviteLink}">Click here to add bot to group</a>\n\n` +
            `Or search for: @${botUsername}`, { parse_mode: 'HTML' });
    }
}
exports.CommandHandlers = CommandHandlers;
//# sourceMappingURL=commandHandlers.js.map