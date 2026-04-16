import { Context, Telegraf } from 'telegraf';
import { StateManager } from '../services/stateManager';
import { StudentService } from '../services/studentService';
import { DutyService } from '../services/dutyService';
import { MessageTracker } from '../services/messageTracker';
import { PAYMENT_STEPS } from '../config/constants';
import { MESSAGES, formatDutiesMessage } from '../utils/messages';
import { getPaymentConfirmKeyboard, getWeeklyScheduleKeyboard, getPaymentStartKeyboard } from '../utils/keyboard';
import { formatPaymentMessage } from '../utils/messages';
import { formatDate, getCurrentMonth } from '../utils/date';

export class MessageHandlers {
  static async handleText(ctx: Context): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    if (!('text' in ctx.message!)) return;
    const text = ctx.message.text;
    if (!text) return;

    console.log('[MessageHandlers] Received text:', text);

    // Handle keyboard button clicks FIRST
    const isKeyboardButton = await this.handleKeyboardButton(ctx, text);
    if (isKeyboardButton) {
      console.log('[MessageHandlers] Handled as keyboard button');
      return;
    }

    const state = StateManager.get(userId);
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
      if (state.step === PAYMENT_STEPS.WAITING_FOR_NICK) {
        // Track user message
        MessageTracker.trackUserMessage(userId, ctx.message!.message_id);
        await this.handleNickInput(ctx, userId, text, state);
      }
    } catch (error: any) {
      console.error('[MessageHandlers] Error processing text:', error.message);
      await ctx.reply(MESSAGES.ERROR);
    }
  }

  private static async handleKeyboardButton(ctx: Context, text: string): Promise<boolean> {
    const userId = ctx.from?.id;
    if (!userId) return false;

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

  private static async startPayment(ctx: Context, userId: number): Promise<void> {
    try {
      // Clean up previous operation messages
      await MessageTracker.cleanup(ctx, userId);

      StateManager.set(userId, {
        step: PAYMENT_STEPS.WAITING_FOR_NICK,
        data: { month: getCurrentMonth(), messageIds: [] }
      });

      const msg = await ctx.reply(MESSAGES.PAYMENT_START, {
        reply_markup: getPaymentStartKeyboard()
      });
      MessageTracker.trackBotMessage(userId, msg.message_id);
      
      const state = StateManager.get(userId);
      if (state) {
        state.data.messageIds = [msg.message_id];
        StateManager.set(userId, state);
      }
    } catch (error: any) {
      console.error('[MessageHandlers] Error starting payment:', error.message);
      await ctx.reply(MESSAGES.ERROR);
    }
  }

  private static async cancelPayment(ctx: Context, userId: number): Promise<void> {
    try {
      // Clean up all tracked messages
      await MessageTracker.cleanup(ctx, userId);
      
      // Delete state
      StateManager.delete(userId);
      
      await ctx.reply(MESSAGES.PAYMENT_CANCELLED_FULL, {
        reply_markup: { remove_keyboard: true }
      });
    } catch (error: any) {
      console.error('[MessageHandlers] Error cancelling payment:', error.message);
    }
  }

  private static async showInfo(ctx: Context): Promise<void> {
    await ctx.reply(
      `ℹ️ SmartHostel Bot\n\n` +
      `Bu bot hostel boshqaruvi uchun yaratilgan.\n\n` +
      `Imkoniyatlar:\n` +
      `• Navbatchiliklar jadvali\n` +
      `• Bildirishnomalar\n\n` +
      `Yordam uchun: /help`
    );
  }

  private static async showHelp(ctx: Context): Promise<void> {
    await ctx.reply(MESSAGES.HELP);
  }

  private static async showTodayDuties(ctx: Context): Promise<void> {
    try {
      const today = new Date();
      const duties = await DutyService.getDutiesForDate(today);
      
      const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
      const dayName = days[today.getDay()];
      const dayNum = today.getDate();
      const monthNum = today.getMonth() + 1;
      const year = today.getFullYear();
      
      const title = `📅 Bugun: ${dayName}, ${dayNum}.${monthNum}.${year}`;
      const message = formatDutiesMessage(title, duties);
      
      await ctx.reply(message, {
        parse_mode: 'Markdown'
      });
    } catch (error: any) {
      console.error('[MessageHandlers] Error fetching today duties:', error.message);
      await ctx.reply(MESSAGES.DUTIES_NOT_FOUND);
    }
  }

  private static async showTomorrowDuties(ctx: Context): Promise<void> {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const duties = await DutyService.getDutiesForDate(tomorrow);
      
      const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
      const dayName = days[tomorrow.getDay()];
      const dayNum = tomorrow.getDate();
      const monthNum = tomorrow.getMonth() + 1;
      const year = tomorrow.getFullYear();
      
      const title = `📅 Ertaga: ${dayName}, ${dayNum}.${monthNum}.${year}`;
      const message = formatDutiesMessage(title, duties);
      
      await ctx.reply(message, {
        parse_mode: 'Markdown'
      });
    } catch (error: any) {
      console.error('[MessageHandlers] Error fetching tomorrow duties:', error.message);
      await ctx.reply(MESSAGES.DUTIES_NOT_FOUND);
    }
  }

  private static async showWeeklySchedule(ctx: Context): Promise<void> {
    await ctx.reply(
      '📆 Haftalik navbatchilik jadvali\n\n' +
      'Quyidagi kunlardan birini tanlang:',
      {
        reply_markup: getWeeklyScheduleKeyboard()
      }
    );
  }

  private static async handleNickInput(ctx: Context, userId: number, text: string, state: any): Promise<void> {
    let school21Nick = text.trim();
    
    // Remove @ if present
    if (school21Nick.startsWith('@')) {
      school21Nick = school21Nick.substring(1);
    }

    console.log('[MessageHandlers] Looking for student:', school21Nick);
    
    const student = await StudentService.findByUsername(school21Nick);

    if (!student) {
      const msg = await ctx.reply(MESSAGES.STUDENT_NOT_FOUND(school21Nick));
      MessageTracker.trackBotMessage(userId, msg.message_id);
      return;
    }

    // Clean up all tracked messages (bot prompts + user input)
    await MessageTracker.cleanup(ctx, userId);

    // Update state
    StateManager.updateData(userId, {
      school21Nick,
      fullName: student.fullName || student.username,
      room: student.room || '-',
      studentId: student.id,
      messageIds: []
    });

    state.step = PAYMENT_STEPS.WAITING_FOR_FILE;
    StateManager.set(userId, state);

    const msg = await ctx.reply(
      MESSAGES.STUDENT_FOUND(student.fullName || student.username, student.room || '-'),
      { reply_markup: { remove_keyboard: true } }
    );
    MessageTracker.trackBotMessage(userId, msg.message_id);

    StateManager.updateData(userId, { messageIds: [msg.message_id] });
  }

  static async handlePhoto(ctx: Context, bot: Telegraf): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const state = StateManager.get(userId);
    if (!state || state.step !== PAYMENT_STEPS.WAITING_FOR_FILE) {
      return;
    }

    try {
      // Track user's photo message
      MessageTracker.trackUserMessage(userId, (ctx.message as any).message_id);

      const photos = (ctx.message as any).photo;
      const photo = photos[photos.length - 1];
      const fileId = photo.file_id;

      await this.handleFileUpload(ctx, bot, userId, state, fileId, 'photo');
    } catch (error: any) {
      console.error('[MessageHandlers] Error processing photo:', error.message);
      await ctx.reply(MESSAGES.ERROR);
      StateManager.delete(userId);
    }
  }

  static async handleDocument(ctx: Context, bot: Telegraf): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const state = StateManager.get(userId);
    if (!state || state.step !== PAYMENT_STEPS.WAITING_FOR_FILE) {
      return;
    }

    try {
      // Track user's document message
      MessageTracker.trackUserMessage(userId, (ctx.message as any).message_id);

      const document = (ctx.message as any).document;
      const fileId = document.file_id;

      await this.handleFileUpload(ctx, bot, userId, state, fileId, 'document');
    } catch (error: any) {
      console.error('[MessageHandlers] Error processing document:', error.message);
      await ctx.reply(MESSAGES.ERROR);
      StateManager.delete(userId);
    }
  }

  private static async handleFileUpload(
    ctx: Context,
    bot: Telegraf,
    userId: number,
    state: any,
    fileId: string,
    fileType: 'photo' | 'document'
  ): Promise<void> {
    // Clean up all previous messages (prompts + user inputs)
    await MessageTracker.cleanup(ctx, userId);

    // Update state with file info
    StateManager.updateData(userId, { fileId, fileType, messageIds: [] });

    // Show preview (this message will NOT be tracked - it's the final preview)
    await this.showPaymentPreview(ctx, state, fileId, fileType);
  }

  private static async showPaymentPreview(
    ctx: Context,
    state: any,
    fileId: string,
    fileType: 'photo' | 'document'
  ): Promise<void> {
    const { school21Nick, fullName, room, month } = state.data;
    const message = formatPaymentMessage(school21Nick, fullName, room, month, formatDate());

    if (fileType === 'photo') {
      await ctx.replyWithPhoto(fileId, {
        caption: message,
        reply_markup: getPaymentConfirmKeyboard()
      });
    } else {
      await ctx.replyWithDocument(fileId, {
        caption: message,
        reply_markup: getPaymentConfirmKeyboard()
      });
    }
  }
}
