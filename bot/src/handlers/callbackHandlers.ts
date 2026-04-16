import { Context, Telegraf } from 'telegraf';
import { CALLBACK_ACTIONS, PAYMENT_STEPS } from '../config/constants';
import { StateManager } from '../services/stateManager';
import { MessageTracker } from '../services/messageTracker';
import { DutyService } from '../services/dutyService';
import { PaymentService } from '../services/paymentService';
import { getMainKeyboard, getPaymentStartKeyboard } from '../utils/keyboard';
import { MESSAGES, formatDutiesMessage } from '../utils/messages';
import { getCurrentMonth } from '../utils/date';

export class CallbackHandlers {
  static async handleCallback(ctx: Context, bot: Telegraf): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const data = (ctx.callbackQuery as any).data;

    // Handle duty date selection
    if (data.startsWith('duty_date_')) {
      await this.handleDutyDate(ctx, data);
      return;
    }

    switch (data) {
      case CALLBACK_ACTIONS.START_OPLATA:
        await this.handleStartOplata(ctx, userId);
        break;
      case CALLBACK_ACTIONS.HELP:
        await this.handleHelp(ctx);
        break;
      case CALLBACK_ACTIONS.SEND_PAYMENT:
        await this.handleSendPayment(ctx, bot, userId);
        break;
      case CALLBACK_ACTIONS.CANCEL_PAYMENT:
        await this.handleCancelPayment(ctx, userId);
        break;
      case 'back_to_menu':
        await this.handleBackToMenu(ctx);
        break;
    }
  }

  private static async handleStartOplata(ctx: Context, userId: number): Promise<void> {
    await ctx.answerCbQuery();
    
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
      console.error('[CallbackHandlers] Error starting payment:', error.message);
      await ctx.reply(MESSAGES.ERROR);
    }
  }

  private static async handleHelp(ctx: Context): Promise<void> {
    await ctx.answerCbQuery();
    await ctx.reply(MESSAGES.HELP, {
      reply_markup: getMainKeyboard()
    });
  }

  private static async handleSendPayment(ctx: Context, bot: Telegraf, userId: number): Promise<void> {
    const state = StateManager.get(userId);
    if (!state) {
      await ctx.answerCbQuery(MESSAGES.SESSION_EXPIRED);
      return;
    }

    await ctx.answerCbQuery(MESSAGES.SENDING);

    const { school21Nick, fullName, room, month, fileId, fileType, studentId } = state.data;

    try {
      // Submit to database
      await PaymentService.submitPayment({
        studentId: studentId || 0,
        amount: 0,
        month: month!,
        imageUrl: fileId!,
        status: 'pending',
        note: `School21: @${school21Nick}, Ism: ${fullName}, Xona: ${room}`
      });

      // Send to group
      await PaymentService.sendToGroup(
        bot,
        school21Nick!,
        fullName!,
        room!,
        month!,
        fileId!,
        fileType!
      );

      // Delete preview
      try {
        await ctx.deleteMessage();
      } catch (e) {
        console.log('[CallbackHandlers] Could not delete preview');
      }

      // Send confirmation (this is kept - final result message)
      await ctx.reply(MESSAGES.PAYMENT_SENT(school21Nick!, fullName!, room!, month!), {
        reply_markup: getMainKeyboard()
      });

      // Clear state and tracking
      StateManager.delete(userId);
      MessageTracker.clear(userId);
    } catch (error) {
      console.error('[CallbackHandlers] Error sending payment:', error);
      await ctx.reply(MESSAGES.ERROR);
    }
  }

  private static async handleCancelPayment(ctx: Context, userId: number): Promise<void> {
    StateManager.delete(userId);
    await ctx.answerCbQuery(MESSAGES.CANCELLED);
    
    try {
      await ctx.deleteMessage();
    } catch (e) {
      console.log('[CallbackHandlers] Could not delete preview message');
    }
    
    // Send cancellation message (this is kept - final result)
    await ctx.reply(MESSAGES.PAYMENT_CANCELLED_FULL, {
      reply_markup: getMainKeyboard()
    });

    // Clear tracking
    MessageTracker.clear(userId);
  }

  private static async handleDutyDate(ctx: Context, data: string): Promise<void> {
    await ctx.answerCbQuery();
    
    try {
      // Extract date from callback data: duty_date_YYYY-MM-DD
      const dateStr = data.replace('duty_date_', '');
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        await ctx.reply(MESSAGES.ERROR);
        return;
      }

      const duties = await DutyService.getDutiesForDate(date);
      
      // Format date for display
      const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
      const dayName = days[date.getDay()];
      const dayNum = date.getDate();
      const monthNum = date.getMonth() + 1;
      const year = date.getFullYear();
      
      const title = `${dayName}, ${dayNum}.${monthNum}.${year}`;
      const message = formatDutiesMessage(title, duties);
      
      await ctx.reply(message, {
        parse_mode: 'Markdown',
        reply_markup: getMainKeyboard()
      });
    } catch (error: any) {
      console.error('[CallbackHandlers] Error fetching duties for date:', error.message);
      await ctx.reply(MESSAGES.DUTIES_NOT_FOUND);
    }
  }

  private static async handleBackToMenu(ctx: Context): Promise<void> {
    await ctx.answerCbQuery();
    
    try {
      await ctx.deleteMessage();
    } catch (e) {
      console.log('[CallbackHandlers] Could not delete message');
    }
    
    await ctx.reply(
      'Asosiy menyu',
      {
        reply_markup: getMainKeyboard()
      }
    );
  }
}
