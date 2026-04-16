import { Context } from 'telegraf';
export declare class CommandHandlers {
    static handleStart(ctx: Context): Promise<void>;
    static handleHelp(ctx: Context): Promise<void>;
    static handleOplata(ctx: Context): Promise<void>;
    static handleCancel(ctx: Context): Promise<void>;
    static handleToday(ctx: Context): Promise<void>;
    static handleTomorrow(ctx: Context): Promise<void>;
    static handleGroupId(ctx: Context): Promise<void>;
    static handleInvite(ctx: Context): Promise<void>;
}
