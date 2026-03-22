/**
 * Duty generation algorithm:
 * - 3 students per floor per day
 * - 4 floors total
 * - Uses rotation queue to ensure fair distribution
 * - Skips frozen students
 */
export declare class DutyService {
    /**
     * Generate duties for a specific date
     * Assigns 3 students per floor (12 total students per day)
     */
    static generateDutiesForDate(date: Date): Promise<any>;
    /**
     * Assign 3 students to a specific floor
     * Uses rotation queue to ensure fair distribution
     */
    private static assignStudentsToFloor;
    /**
     * Get duties for a specific date with students
     */
    static getDutiesForDate(date: Date): Promise<{
        id: number;
        date: Date;
        status: string;
        byFloor: Record<number, any[]>;
        allStudents: any[];
    } | null>;
    /**
     * Get duties for a date range
     */
    static getDutiesForRange(startDate: Date, endDate: Date): Promise<{
        id: any;
        date: any;
        status: any;
        byFloor: Record<number, any[]>;
        allStudents: any;
    }[]>;
    /**
     * Update duty status
     */
    static updateDutyStatus(dutyId: number, status: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        date: Date;
        status: string;
    }>;
}
//# sourceMappingURL=dutyService.d.ts.map