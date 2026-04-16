"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageTracker = void 0;
/**
 * MessageTracker - Smart message tracking and cleanup service
 *
 * Principles:
 * 1. Track all bot and user messages during operations
 * 2. Clean up when starting new operations
 * 3. Keep important messages (confirmations, results)
 * 4. Graceful error handling
 */
class MessageTracker {
    /**
     * Track a bot message
     */
    static trackBotMessage(userId, messageId) {
        const tracked = this.getOrCreate(userId);
        tracked.botMessages.push(messageId);
        tracked.lastActivity = new Date();
        this.messages.set(userId, tracked);
    }
    /**
     * Track a user message
     */
    static trackUserMessage(userId, messageId) {
        const tracked = this.getOrCreate(userId);
        tracked.userMessages.push(messageId);
        tracked.lastActivity = new Date();
        this.messages.set(userId, tracked);
    }
    /**
     * Clean up all tracked messages for a user
     */
    static async cleanup(ctx, userId) {
        const tracked = this.messages.get(userId);
        if (!tracked)
            return;
        console.log(`[MessageTracker] Cleaning up ${tracked.botMessages.length} bot messages and ${tracked.userMessages.length} user messages`);
        // Delete bot messages
        for (const msgId of tracked.botMessages) {
            try {
                await ctx.deleteMessage(msgId);
            }
            catch (error) {
                // Silently fail - message might be already deleted or too old
                console.log(`[MessageTracker] Could not delete bot message ${msgId}`);
            }
        }
        // Delete user messages
        for (const msgId of tracked.userMessages) {
            try {
                await ctx.deleteMessage(msgId);
            }
            catch (error) {
                console.log(`[MessageTracker] Could not delete user message ${msgId}`);
            }
        }
        // Clear tracking
        this.messages.delete(userId);
    }
    /**
     * Clean up only bot messages (keep user messages)
     */
    static async cleanupBotMessages(ctx, userId) {
        const tracked = this.messages.get(userId);
        if (!tracked)
            return;
        console.log(`[MessageTracker] Cleaning up ${tracked.botMessages.length} bot messages`);
        for (const msgId of tracked.botMessages) {
            try {
                await ctx.deleteMessage(msgId);
            }
            catch (error) {
                console.log(`[MessageTracker] Could not delete bot message ${msgId}`);
            }
        }
        tracked.botMessages = [];
        this.messages.set(userId, tracked);
    }
    /**
     * Clear tracking without deleting messages
     */
    static clear(userId) {
        this.messages.delete(userId);
    }
    /**
     * Get or create tracked messages for user
     */
    static getOrCreate(userId) {
        const existing = this.messages.get(userId);
        if (existing)
            return existing;
        const newTracked = {
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
    static cleanupStale() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        for (const [userId, tracked] of this.messages.entries()) {
            if (tracked.lastActivity < oneHourAgo) {
                console.log(`[MessageTracker] Removing stale session for user ${userId}`);
                this.messages.delete(userId);
            }
        }
    }
}
exports.MessageTracker = MessageTracker;
MessageTracker.messages = new Map();
// Run cleanup every 30 minutes
setInterval(() => {
    MessageTracker.cleanupStale();
}, 30 * 60 * 1000);
//# sourceMappingURL=messageTracker.js.map