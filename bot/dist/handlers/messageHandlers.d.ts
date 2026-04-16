import { Context, Telegraf } from 'telegraf';
export declare class MessageHandlers {
    static handleText(ctx: Context): Promise<void>;
    private static handleKeyboardButton;
    private static startPayment;
    private static cancelPayment;
    private static showInfo;
    private static showHelp;
    private static showWeeklySchedule;
    private static handleNickInput;
    static handlePhoto(ctx: Context, bot: Telegraf): Promise<void>;
    static handleDocument(ctx: Context, bot: Telegraf): Promise<void>;
    private static handleFileUpload;
    private static showPaymentPreview;
}
