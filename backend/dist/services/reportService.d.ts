export declare class ReportService {
    /**
     * Create a report (photo upload)
     */
    static createReport(data: {
        studentId: number;
        dutyDate: Date;
        photoUrl: string;
    }): Promise<{
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
        notes: string | null;
    }>;
    /**
     * Get reports for a specific date
     */
    static getReportsForDate(date: Date): Promise<({
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
        notes: string | null;
    })[]>;
    /**
     * Get reports for a student
     */
    static getReportsForStudent(studentId: number): Promise<({
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
        notes: string | null;
    })[]>;
    /**
     * Get all pending reports
     */
    static getPendingReports(): Promise<({
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
        notes: string | null;
    })[]>;
    /**
     * Approve a report
     */
    static approveReport(id: number): Promise<{
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
        notes: string | null;
    }>;
    /**
     * Reject a report
     */
    static rejectReport(id: number, notes?: string): Promise<{
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
        notes: string | null;
    }>;
    /**
     * Get report by ID
     */
    static getReportById(id: number): Promise<({
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
        notes: string | null;
    }) | null>;
    /**
     * Get reports for date range
     */
    static getReportsForRange(startDate: Date, endDate: Date, status?: string): Promise<({
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
        notes: string | null;
    })[]>;
}
//# sourceMappingURL=reportService.d.ts.map