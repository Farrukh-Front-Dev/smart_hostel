import express from 'express';
import { Telegraf, Context } from 'telegraf';
/**
 * Setup notification endpoint for backend to trigger bot actions
 */
export declare function setupNotificationEndpoint(app: express.Application, bot: Telegraf<Context>): void;
