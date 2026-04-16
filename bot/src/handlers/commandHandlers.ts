import { Context } from 'telegraf';
import { getMainKeyboard } from '../utils/keyboard';
import { MESSAGES } from '../utils/messages';
import { StateManager } from '../services/stateManager';
import { MessageTracker } from '../services/messageTracker';
import { PAYMENT_STEPS } from '../config/constants';
import { getCurrentMonth } from '../utils/date';

export class CommandHandlers {
  static async handleStart(ctx: Context): Promise<void> {
    await ctx.reply(MESSAGES.WELCOME, {
      reply_markup: getMainKeyboard()
    });
  }

  static async handleHelp(ctx: Context): Promise<void> {
    await ctx.reply(MESSAGES.HELP, {
      reply_markup: getMainKeyboard()
    });
  }

  static async handleOplata(ctx: Context): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    try {
      // Clean up previous operation messages
      await MessageTracker.cleanup(ctx, userId);

      StateManager.set(userId, {
        step: PAYMENT_STEPS.WAITING_FOR_NICK,
        data: { month: getCurrentMonth(), messageIds: [] }
      });

      const msg = await ctx.reply(MESSAGES.PAYMENT_START);
      MessageTracker.trackBotMessage(userId, msg.message_id);
      
      const state = StateManager.get(userId);
      if (state) {
        state.data.messageIds = [msg.message_id];
        StateManager.set(userId, state);
      }
    } catch (error: any) {
      console.error('[CommandHandlers] Error starting payment:', error.message);
      await ctx.reply(MESSAGES.ERROR);
    }
  }

  static async handleCancel(ctx: Context): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    if (StateManager.has(userId)) {
      StateManager.delete(userId);
      
      // Clean up all tracked messages
      await MessageTracker.cleanup(ctx, userId);
      
      await ctx.reply(MESSAGES.PAYMENT_CANCELLED, {
        reply_markup: getMainKeyboard()
      });
    } else {
      await ctx.reply(MESSAGES.NO_ACTIVE_OPERATION);
    }
  }

  static async handleToday(ctx: Context): Promise<void> {
    // Handled in callbackHandlers for consistency
  }

  static async handleTomorrow(ctx: Context): Promise<void> {
    // Handled in callbackHandlers for consistency
  }

  static async handleGroupId(ctx: Context): Promise<void> {
    const chatId = ctx.chat?.id;
    const chatType = ctx.chat?.type;
    const chatTitle = (ctx.chat as any)?.title || 'Private Chat';
    
    await ctx.reply(
      `📍 Chat Information:\n\n` +
        `Chat ID: <code>${chatId}</code>\n` +
        `Chat Type: ${chatType}\n` +
        `Chat Name: ${chatTitle}\n\n` +
        `Use this ID in your bot configuration.`,
      { parse_mode: 'HTML' }
    );
  }

  static async handleInvite(ctx: Context): Promise<void> {
    const bot = ctx.telegram;
    const botInfo = await bot.getMe();
    const botUsername = botInfo.username;
    const inviteLink = `https://t.me/${botUsername}`;
    
    await ctx.reply(
      `🔗 Bot Invite Link:\n\n` +
        `<a href="${inviteLink}">Click here to add bot to group</a>\n\n` +
        `Or search for: @${botUsername}`,
      { parse_mode: 'HTML' }
    );
  }
}
