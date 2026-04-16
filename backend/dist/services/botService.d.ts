export declare class BotService {
    /**
     * Create or get bot session for a student
     */
    static getOrCreateSession(studentId: number, dutyDate: Date): Promise<any>;
    /**
     * Update session step
     */
    static updateSessionStep(sessionId: number, step: string, data?: any): Promise<any>;
    /**
     * Complete session
     */
    static completeSession(sessionId: number): Promise<any>;
    /**
     * Cancel session
     */
    static cancelSession(sessionId: number): Promise<any>;
    /**
     * Get active sessions for a duty date
     */
    static getActiveSessionsForDate(dutyDate: Date): Promise<any>;
    /**
     * Get session by student and date
     */
    static getSessionByStudentAndDate(studentId: number, dutyDate: Date): Promise<any>;
}
//# sourceMappingURL=botService.d.ts.map