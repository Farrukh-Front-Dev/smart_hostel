import { Context } from 'telegraf';
interface UserSession {
    studentId: number;
    dutyDate: Date;
    sessionId: number;
    step: 'nickname' | 'photos' | 'confirmation';
    nickname?: string;
    photoCount: number;
    photoFileIds: string[];
    floormates: Array<{
        id: number;
        name: string;
        username: string;
    }>;
}
/**
 * Start duty workflow for a student
 */
export declare function startDutyWorkflow(ctx: Context, studentId: number, dutyDate: Date): Promise<void>;
/**
 * Handle nickname input
 */
export declare function handleNicknameInput(ctx: Context, text: string): Promise<void>;
/**
 * Handle photo uploads
 */
export declare function handlePhotoUpload(ctx: Context): Promise<void>;
/**
 * Handle confirmation
 */
export declare function handleConfirmation(ctx: Context, text: string): Promise<void>;
/**
 * Get active session for user
 */
export declare function getActiveSession(userId: number): UserSession | undefined;
/**
 * Clear session
 */
export declare function clearSession(userId: number): void;
export {};
