export declare class BotService {
    /**
     * Create or get bot session for a student
     */
    static getOrCreateSession(studentId: number, dutyDate: Date): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        studentId: number;
        status: string;
        dutyDate: Date;
        photoCount: number;
        step: string;
        nickname: string | null;
        messageIds: string | null;
    }>;
    /**
     * Update session step
     */
    static updateSessionStep(sessionId: number, step: string, data?: any): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        studentId: number;
        status: string;
        dutyDate: Date;
        photoCount: number;
        step: string;
        nickname: string | null;
        messageIds: string | null;
    }>;
    /**
     * Complete session
     */
    static completeSession(sessionId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        studentId: number;
        status: string;
        dutyDate: Date;
        photoCount: number;
        step: string;
        nickname: string | null;
        messageIds: string | null;
    }>;
    /**
     * Cancel session
     */
    static cancelSession(sessionId: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        studentId: number;
        status: string;
        dutyDate: Date;
        photoCount: number;
        step: string;
        nickname: string | null;
        messageIds: string | null;
    }>;
    /**
     * Get active sessions for a duty date
     */
    static getActiveSessionsForDate(dutyDate: Date): Promise<({
        student: {
            username: string;
            floor: number;
            note: string | null;
            telegramId: string | null;
            isFrozen: boolean;
            frozenReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        studentId: number;
        status: string;
        dutyDate: Date;
        photoCount: number;
        step: string;
        nickname: string | null;
        messageIds: string | null;
    })[]>;
    /**
     * Get session by student and date
     */
    static getSessionByStudentAndDate(studentId: number, dutyDate: Date): Promise<({
        student: {
            username: string;
            floor: number;
            note: string | null;
            telegramId: string | null;
            isFrozen: boolean;
            frozenReason: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        studentId: number;
        status: string;
        dutyDate: Date;
        photoCount: number;
        step: string;
        nickname: string | null;
        messageIds: string | null;
    }) | null>;
}
//# sourceMappingURL=botService.d.ts.map