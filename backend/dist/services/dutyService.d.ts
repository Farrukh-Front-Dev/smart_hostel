/**
 * Duty generation algorithm:
 * - 3 active (non-frozen) peers per floor per day
 * - 4 floors total (12 total peers per day)
 * - Uses sequential circular rotation through the list
 * - Day 1: Peers 1,2,3 -> Day 2: Peers 4,5,6 -> ... -> Day 10: Peers 28,29,30 -> Day 11: Peers 1,2,3 (wraps)
 * - Skips frozen peers automatically
 */
export declare class DutyService {
    /**
     * Generate duties for a specific date
     * Assigns 3 students per floor (12 total students per day)
     */
    static generateDutiesForDate(date: Date): Promise<any>;
    /**
     * Assign 3 students to a specific floor using sequential circular rotation
     * Cycles through the list sequentially: 1,2,3 -> 4,5,6 -> ... -> wraps around
     * Returns empty array if no students available (will show as INTENSIV)
     */
    private static assignStudentsToFloor;
    /**
     * Get duties for a specific date with students
     */
    static getDutiesForDate(date: Date): Promise<{
        id: number;
        date: string;
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