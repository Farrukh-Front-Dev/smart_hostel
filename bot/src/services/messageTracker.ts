import { Context } from 'telegraf';

interface TrackedMessages {
  botMessages: number[];
  userMessages: number[];
  lastActivity: Date;
}

/**
 * MessageTracker - Smart message tracking and cleanup service
 * 
 * Principles:
 * 1. Track all bot and user messages during operations
 * 2. Clean up when starting new operations
 * 3. Keep important messages (confirmations, results)
 * 4. Graceful error handling
 */
export class MessageTracker {
  private static messages = new Map<number, TrackedMessages>();
  
  /**
   * Track a bot message
   */
  static trackBotMessage(userId: number, messageId: number): void {
    const tracked = this.getOrCreate(userId);
    tracked.botMessages.push(messageId);
    tracked.lastActivity = new Date();
    this.messages.set(userId, tracked);
  }

  /**
   * Track a user message
   */
  static trackUserMessage(userId: number, messageId: number): void {
    const tracked = this.getOrCreate(userId);
    tracked.userMessages.push(messageId);
    tracked.lastActivity = new Date();
    this.messages.set(userId, tracked);
  }

  /**
   * Clean up all tracked messages for a user
   */
  static async cleanup(ctx: Context, userId: number): Promise<void> {
    const tracked = this.messages.get(userId);
    if (!tracked) return;

    console.log(`[MessageTracker] Cleaning up ${tracked.botMessages.length} bot messages and ${tracked.userMessages.length} user messages`);

    // Delete bot messages
    for (const msgId of tracked.botMessages) {
      try {
        await ctx.deleteMessage(msgId);
      } catch (error) {
        // Silently fail - message might be already deleted or too old
        console.log(`[MessageTracker] Could not delete bot message ${msgId}`);
      }
    }

    // Delete user messages
    for (const msgId of tracked.userMessages) {
      try {
        await ctx.deleteMessage(msgId);
      } catch (error) {
        console.log(`[MessageTracker] Could not delete user message ${msgId}`);
      }
    }

    // Clear tracking
    this.messages.delete(userId);
  }

  /**
   * Clean up only bot messages (keep user messages)
   */
  static async cleanupBotMessages(ctx: Context, userId: number): Promise<void> {
    const tracked = this.messages.get(userId);
    if (!tracked) return;

    console.log(`[MessageTracker] Cleaning up ${tracked.botMessages.length} bot messages`);

    for (const msgId of tracked.botMessages) {
      try {
        await ctx.deleteMessage(msgId);
      } catch (error) {
        console.log(`[MessageTracker] Could not delete bot message ${msgId}`);
      }
    }

    tracked.botMessages = [];
    this.messages.set(userId, tracked);
  }

  /**
   * Clear tracking without deleting messages
   */
  static clear(userId: number): void {
    this.messages.delete(userId);
  }

  /**
   * Get or create tracked messages for user
   */
  private static getOrCreate(userId: number): TrackedMessages {
    const existing = this.messages.get(userId);
    if (existing) return existing;

    const newTracked: TrackedMessages = {
      botMessages: [],
      userMessages: [],
      lastActivity: new Date()
    };
    this.messages.set(userId, newTracked);
    return newTracked;
  }

  /**
   * Clean up stale sessions (older than 1 hour)
   */
  static cleanupStale(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [userId, tracked] of this.messages.entries()) {
      if (tracked.lastActivity < oneHourAgo) {
        console.log(`[MessageTracker] Removing stale session for user ${userId}`);
        this.messages.delete(userId);
      }
    }
  }
}

// Run cleanup every 30 minutes
setInterval(() => {
  MessageTracker.cleanupStale();
}, 30 * 60 * 1000);
