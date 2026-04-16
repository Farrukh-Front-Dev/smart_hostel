import { Context, Telegraf } from 'telegraf';
export declare class CallbackHandlers {
    static handleCallback(ctx: Context, bot: Telegraf): Promise<void>;
    private static handleStartOplata;
    private static handleHelp;
    private static handleSendPayment;
    private static handleCancelPayment;
    private static handleDutyDate;
    private static handleBackToMenu;
}
