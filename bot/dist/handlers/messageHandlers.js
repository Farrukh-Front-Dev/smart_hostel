"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandlers = void 0;
const stateManager_1 = require("../services/stateManager");
const studentService_1 = require("../services/studentService");
const dutyService_1 = require("../services/dutyService");
const messageTracker_1 = require("../services/messageTracker");
const constants_1 = require("../config/constants");
const messages_1 = require("../utils/messages");
const keyboard_1 = require("../utils/keyboard");
const messages_2 = require("../utils/messages");
const date_1 = require("../utils/date");
class MessageHandlers {
    static async handleText(ctx) {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        if (!('text' in ctx.message))
            return;
        const text = ctx.message.text;
        if (!text)
            return;
        console.log('[MessageHandlers] Received text:', text);
        // Handle keyboard button clicks FIRST
        const isKeyboardButton = await this.handleKeyboardButton(ctx, text);
        if (isKeyboardButton) {
            console.log('[MessageHandlers] Handled as keyboard button');
            return;
        }
        const state = stateManager_1.StateManager.get(userId);
        if (!state) {
            console.log('[MessageHandlers] No state found for user');
            return;
        }
        // Skip commands
        if (text.startsWith('/')) {
            console.log('[MessageHandlers] Skipping command');
            return;
        }
        try {
            if (state.step === constants_1.PAYMENT_STEPS.WAITING_FOR_NICK) {
                // Track user message
                messageTracker_1.MessageTracker.trackUserMessage(userId, ctx.message.message_id);
                await this.handleNickInput(ctx, userId, text, state);
            }
        }
        catch (error) {
            console.error('[MessageHandlers] Error processing text:', error.message);
            await ctx.reply(messages_1.MESSAGES.ERROR);
        }
    }
    static async handleKeyboardButton(ctx, text) {
        const userId = ctx.from?.id;
        if (!userId)
            return false;
        console.log('[MessageHandlers] Checking keyboard button:', text);
        switch (text) {
            case '💳 Oplata yuborish':
                console.log('[MessageHandlers] Starting payment');
                await this.startPayment(ctx, userId);
                return true;
            case '📅 Bugungi navbatchilik':
                console.log('[MessageHandlers] Showing today duties');
                await this.showTodayDuties(ctx);
                return true;
            case '📅 Ertangi navbatchilik':
                console.log('[MessageHandlers] Showing tomorrow duties');
                await this.showTomorrowDuties(ctx);
                return true;
            case '❌ Bekor qilish':
                console.log('[MessageHandlers] Cancelling payment');
                await this.cancelPayment(ctx, userId);
                return true;
            default:
                console.log('[MessageHandlers] Not a keyboard button');
                return false;
        }
    }
    static async startPayment(ctx, userId) {
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
            console.error('[MessageHandlers] Error starting payment:', error.message);
            await ctx.reply(messages_1.MESSAGES.ERROR);
        }
    }
    static async cancelPayment(ctx, userId) {
        try {
            // Clean up all tracked messages
            await messageTracker_1.MessageTracker.cleanup(ctx, userId);
            // Delete state
            stateManager_1.StateManager.delete(userId);
            await ctx.reply(messages_1.MESSAGES.PAYMENT_CANCELLED_FULL, {
                reply_markup: { remove_keyboard: true }
            });
        }
        catch (error) {
            console.error('[MessageHandlers] Error cancelling payment:', error.message);
        }
    }
    static async showInfo(ctx) {
        await ctx.reply(`ℹ️ SmartHostel Bot\n\n` +
            `Bu bot hostel boshqaruvi uchun yaratilgan.\n\n` +
            `Imkoniyatlar:\n` +
            `• Navbatchiliklar jadvali\n` +
            `• Bildirishnomalar\n\n` +
            `Yordam uchun: /help`);
    }
    static async showHelp(ctx) {
        await ctx.reply(messages_1.MESSAGES.HELP);
    }
    static async showTodayDuties(ctx) {
        try {
            const today = new Date();
            const duties = await dutyService_1.DutyService.getDutiesForDate(today);
            const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
            const dayName = days[today.getDay()];
            const dayNum = today.getDate();
            const monthNum = today.getMonth() + 1;
            const year = today.getFullYear();
            const title = `📅 Bugun: ${dayName}, ${dayNum}.${monthNum}.${year}`;
            const message = (0, messages_1.formatDutiesMessage)(title, duties);
            await ctx.reply(message, {
                parse_mode: 'Markdown'
            });
        }
        catch (error) {
            console.error('[MessageHandlers] Error fetching today duties:', error.message);
            await ctx.reply(messages_1.MESSAGES.DUTIES_NOT_FOUND);
        }
    }
    static async showTomorrowDuties(ctx) {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const duties = await dutyService_1.DutyService.getDutiesForDate(tomorrow);
            const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
            const dayName = days[tomorrow.getDay()];
            const dayNum = tomorrow.getDate();
            const monthNum = tomorrow.getMonth() + 1;
            const year = tomorrow.getFullYear();
            const title = `📅 Ertaga: ${dayName}, ${dayNum}.${monthNum}.${year}`;
            const message = (0, messages_1.formatDutiesMessage)(title, duties);
            await ctx.reply(message, {
                parse_mode: 'Markdown'
            });
        }
        catch (error) {
            console.error('[MessageHandlers] Error fetching tomorrow duties:', error.message);
            await ctx.reply(messages_1.MESSAGES.DUTIES_NOT_FOUND);
        }
    }
    static async showWeeklySchedule(ctx) {
        await ctx.reply('📆 Haftalik navbatchilik jadvali\n\n' +
            'Quyidagi kunlardan birini tanlang:', {
            reply_markup: (0, keyboard_1.getWeeklyScheduleKeyboard)()
        });
    }
    static async handleNickInput(ctx, userId, text, state) {
        let school21Nick = text.trim();
        // Remove @ if present
        if (school21Nick.startsWith('@')) {
            school21Nick = school21Nick.substring(1);
        }
        console.log('[MessageHandlers] Looking for student:', school21Nick);
        const student = await studentService_1.StudentService.findByUsername(school21Nick);
        if (!student) {
            const msg = await ctx.reply(messages_1.MESSAGES.STUDENT_NOT_FOUND(school21Nick));
            messageTracker_1.MessageTracker.trackBotMessage(userId, msg.message_id);
            return;
        }
        // Clean up all tracked messages (bot prompts + user input)
        await messageTracker_1.MessageTracker.cleanup(ctx, userId);
        // Update state
        stateManager_1.StateManager.updateData(userId, {
            school21Nick,
            fullName: student.fullName || student.username,
            room: student.room || '-',
            studentId: student.id,
            messageIds: []
        });
        state.step = constants_1.PAYMENT_STEPS.WAITING_FOR_FILE;
        stateManager_1.StateManager.set(userId, state);
        const msg = await ctx.reply(messages_1.MESSAGES.STUDENT_FOUND(student.fullName || student.username, student.room || '-'), { reply_markup: { remove_keyboard: true } });
        messageTracker_1.MessageTracker.trackBotMessage(userId, msg.message_id);
        stateManager_1.StateManager.updateData(userId, { messageIds: [msg.message_id] });
    }
    static async handlePhoto(ctx, bot) {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        const state = stateManager_1.StateManager.get(userId);
        if (!state || state.step !== constants_1.PAYMENT_STEPS.WAITING_FOR_FILE) {
            return;
        }
        try {
            // Track user's photo message
            messageTracker_1.MessageTracker.trackUserMessage(userId, ctx.message.message_id);
            const photos = ctx.message.photo;
            const photo = photos[photos.length - 1];
            const fileId = photo.file_id;
            await this.handleFileUpload(ctx, bot, userId, state, fileId, 'photo');
        }
        catch (error) {
            console.error('[MessageHandlers] Error processing photo:', error.message);
            await ctx.reply(messages_1.MESSAGES.ERROR);
            stateManager_1.StateManager.delete(userId);
        }
    }
    static async handleDocument(ctx, bot) {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        const state = stateManager_1.StateManager.get(userId);
        if (!state || state.step !== constants_1.PAYMENT_STEPS.WAITING_FOR_FILE) {
            return;
        }
        try {
            // Track user's document message
            messageTracker_1.MessageTracker.trackUserMessage(userId, ctx.message.message_id);
            const document = ctx.message.document;
            const fileId = document.file_id;
            await this.handleFileUpload(ctx, bot, userId, state, fileId, 'document');
        }
        catch (error) {
            console.error('[MessageHandlers] Error processing document:', error.message);
            await ctx.reply(messages_1.MESSAGES.ERROR);
            stateManager_1.StateManager.delete(userId);
        }
    }
    static async handleFileUpload(ctx, bot, userId, state, fileId, fileType) {
        // Clean up all previous messages (prompts + user inputs)
        await messageTracker_1.MessageTracker.cleanup(ctx, userId);
        // Update state with file info
        stateManager_1.StateManager.updateData(userId, { fileId, fileType, messageIds: [] });
        // Show preview (this message will NOT be tracked - it's the final preview)
        await this.showPaymentPreview(ctx, state, fileId, fileType);
    }
    static async showPaymentPreview(ctx, state, fileId, fileType) {
        const { school21Nick, fullName, room, month } = state.data;
        const message = (0, messages_2.formatPaymentMessage)(school21Nick, fullName, room, month, (0, date_1.formatDate)());
        if (fileType === 'photo') {
            await ctx.replyWithPhoto(fileId, {
                caption: message,
                reply_markup: (0, keyboard_1.getPaymentConfirmKeyboard)()
            });
        }
        else {
            await ctx.replyWithDocument(fileId, {
                caption: message,
                reply_markup: (0, keyboard_1.getPaymentConfirmKeyboard)()
            });
        }
    }
}
exports.MessageHandlers = MessageHandlers;
//# sourceMappingURL=messageHandlers.js.map