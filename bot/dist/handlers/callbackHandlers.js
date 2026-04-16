"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallbackHandlers = void 0;
const constants_1 = require("../config/constants");
const stateManager_1 = require("../services/stateManager");
const messageTracker_1 = require("../services/messageTracker");
const dutyService_1 = require("../services/dutyService");
const paymentService_1 = require("../services/paymentService");
const keyboard_1 = require("../utils/keyboard");
const messages_1 = require("../utils/messages");
const date_1 = require("../utils/date");
class CallbackHandlers {
    static async handleCallback(ctx, bot) {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        const data = ctx.callbackQuery.data;
        // Handle duty date selection
        if (data.startsWith('duty_date_')) {
            await this.handleDutyDate(ctx, data);
            return;
        }
        switch (data) {
            case constants_1.CALLBACK_ACTIONS.START_OPLATA:
                await this.handleStartOplata(ctx, userId);
                break;
            case constants_1.CALLBACK_ACTIONS.HELP:
                await this.handleHelp(ctx);
                break;
            case constants_1.CALLBACK_ACTIONS.SEND_PAYMENT:
                await this.handleSendPayment(ctx, bot, userId);
                break;
            case constants_1.CALLBACK_ACTIONS.CANCEL_PAYMENT:
                await this.handleCancelPayment(ctx, userId);
                break;
            case 'back_to_menu':
                await this.handleBackToMenu(ctx);
                break;
        }
    }
    static async handleStartOplata(ctx, userId) {
        await ctx.answerCbQuery();
        try {
            // Clean up previous operation messages
            await messageTracker_1.MessageTracker.cleanup(ctx, userId);
            stateManager_1.StateManager.set(userId, {
                step: constants_1.PAYMENT_STEPS.WAITING_FOR_NICK,
                data: { month: (0, date_1.getCurrentMonth)(), messageIds: [] }
            });
            const msg = await ctx.reply(messages_1.MESSAGES.PAYMENT_START, {
                reply_markup: (0, keyboard_1.getPaymentStartKeyboard)()
            });
            messageTracker_1.MessageTracker.trackBotMessage(userId, msg.message_id);
            const state = stateManager_1.StateManager.get(userId);
            if (state) {
                state.data.messageIds = [msg.message_id];
                stateManager_1.StateManager.set(userId, state);
            }
        }
        catch (error) {
            console.error('[CallbackHandlers] Error starting payment:', error.message);
            await ctx.reply(messages_1.MESSAGES.ERROR);
        }
    }
    static async handleHelp(ctx) {
        await ctx.answerCbQuery();
        await ctx.reply(messages_1.MESSAGES.HELP, {
            reply_markup: (0, keyboard_1.getMainKeyboard)()
        });
    }
    static async handleSendPayment(ctx, bot, userId) {
        const state = stateManager_1.StateManager.get(userId);
        if (!state) {
            await ctx.answerCbQuery(messages_1.MESSAGES.SESSION_EXPIRED);
            return;
        }
        await ctx.answerCbQuery(messages_1.MESSAGES.SENDING);
        const { school21Nick, fullName, room, month, fileId, fileType, studentId } = state.data;
        try {
            // Submit to database
            await paymentService_1.PaymentService.submitPayment({
                studentId: studentId || 0,
                amount: 0,
                month: month,
                imageUrl: fileId,
                status: 'pending',
                note: `School21: @${school21Nick}, Ism: ${fullName}, Xona: ${room}`
            });
            // Send to group
            await paymentService_1.PaymentService.sendToGroup(bot, school21Nick, fullName, room, month, fileId, fileType);
            // Delete preview
            try {
                await ctx.deleteMessage();
            }
            catch (e) {
                console.log('[CallbackHandlers] Could not delete preview');
            }
            // Send confirmation (this is kept - final result message)
            await ctx.reply(messages_1.MESSAGES.PAYMENT_SENT(school21Nick, fullName, room, month), {
                reply_markup: (0, keyboard_1.getMainKeyboard)()
            });
            // Clear state and tracking
            stateManager_1.StateManager.delete(userId);
            messageTracker_1.MessageTracker.clear(userId);
        }
        catch (error) {
            console.error('[CallbackHandlers] Error sending payment:', error);
            await ctx.reply(messages_1.MESSAGES.ERROR);
        }
    }
    static async handleCancelPayment(ctx, userId) {
        stateManager_1.StateManager.delete(userId);
        await ctx.answerCbQuery(messages_1.MESSAGES.CANCELLED);
        try {
            await ctx.deleteMessage();
        }
        catch (e) {
            console.log('[CallbackHandlers] Could not delete preview message');
        }
        // Send cancellation message (this is kept - final result)
        await ctx.reply(messages_1.MESSAGES.PAYMENT_CANCELLED_FULL, {
            reply_markup: (0, keyboard_1.getMainKeyboard)()
        });
        // Clear tracking
        messageTracker_1.MessageTracker.clear(userId);
    }
    static async handleDutyDate(ctx, data) {
        await ctx.answerCbQuery();
        try {
            // Extract date from callback data: duty_date_YYYY-MM-DD
            const dateStr = data.replace('duty_date_', '');
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                await ctx.reply(messages_1.MESSAGES.ERROR);
                return;
            }
            const duties = await dutyService_1.DutyService.getDutiesForDate(date);
            // Format date for display
            const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
            const dayName = days[date.getDay()];
            const dayNum = date.getDate();
            const monthNum = date.getMonth() + 1;
            const year = date.getFullYear();
            const title = `${dayName}, ${dayNum}.${monthNum}.${year}`;
            const message = (0, messages_1.formatDutiesMessage)(title, duties);
            await ctx.reply(message, {
                parse_mode: 'Markdown',
                reply_markup: (0, keyboard_1.getMainKeyboard)()
            });
        }
        catch (error) {
            console.error('[CallbackHandlers] Error fetching duties for date:', error.message);
            await ctx.reply(messages_1.MESSAGES.DUTIES_NOT_FOUND);
        }
    }
    static async handleBackToMenu(ctx) {
        await ctx.answerCbQuery();
        try {
            await ctx.deleteMessage();
        }
        catch (e) {
            console.log('[CallbackHandlers] Could not delete message');
        }
        await ctx.reply('Asosiy menyu', {
            reply_markup: (0, keyboard_1.getMainKeyboard)()
        });
    }
}
exports.CallbackHandlers = CallbackHandlers;
//# sourceMappingURL=callbackHandlers.js.map