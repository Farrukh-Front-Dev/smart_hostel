import { Context } from 'telegraf';
/**
 * MessageTracker - Smart message tracking and cleanup service
 *
 * Principles:
 * 1. Track all bot and user messages during operations
 * 2. Clean up when starting new operations
 * 3. Keep important messages (confirmations, results)
 * 4. Graceful error handling
 */
export declare class MessageTracker {
    private static messages;
    /**
     * Track a bot message
     */
    static trackBotMessage(userId: number, messageId: number): void;
    /**
     * Track a user message
     */
    static trackUserMessage(userId: number, messageId: number): void;
    /**
     * Clean up all tracked messages for a user
     */
    static cleanup(ctx: Context, userId: number): Promise<void>;
    /**
     * Clean up only bot messages (keep user messages)
     */
    static cleanupBotMessages(ctx: Context, userId: number): Promise<void>;
    /**
     * Clear tracking without deleting messages
     */
    static clear(userId: number): void;
    /**
     * Get or create tracked messages for user
     */
    private static getOrCreate;
    /**
     * Clean up stale sessions (older than 1 hour)
     */
    static cleanupStale(): void;
}
