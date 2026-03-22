export declare class StudentService {
    /**
     * Create a new student
     */
    static createStudent(data: {
        username: string;
        floor: number;
        note?: string;
    }): Promise<{
        username: string;
        floor: number;
        note: string | null;
        telegramId: string | null;
        isFrozen: boolean;
        frozenReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    /**
     * Get all students
     */
    static getAllStudents(floor?: number): Promise<{
        username: string;
        floor: number;
        note: string | null;
        telegramId: string | null;
        isFrozen: boolean;
        frozenReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    /**
     * Get student by ID
     */
    static getStudentById(id: number): Promise<({
        duties: ({
            duty: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                date: Date;
                status: string;
            };
        } & {
            floor: number;
            createdAt: Date;
            id: number;
            studentId: number;
            dutyId: number;
        })[];
    } & {
        username: string;
        floor: number;
        note: string | null;
        telegramId: string | null;
        isFrozen: boolean;
        frozenReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }) | null>;
    /**
     * Update student
     */
    static updateStudent(id: number, data: Partial<{
        username: string;
        floor: number;
        note: string;
    }>): Promise<{
        username: string;
        floor: number;
        note: string | null;
        telegramId: string | null;
        isFrozen: boolean;
        frozenReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    /**
     * Freeze student (mark as unavailable)
     */
    static freezeStudent(id: number, reason: string): Promise<{
        username: string;
        floor: number;
        note: string | null;
        telegramId: string | null;
        isFrozen: boolean;
        frozenReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    /**
     * Unfreeze student
     */
    static unfreezeStudent(id: number): Promise<{
        username: string;
        floor: number;
        note: string | null;
        telegramId: string | null;
        isFrozen: boolean;
        frozenReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    /**
     * Delete student
     */
    static deleteStudent(id: number): Promise<{
        username: string;
        floor: number;
        note: string | null;
        telegramId: string | null;
        isFrozen: boolean;
        frozenReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    /**
     * Get students by floor
     */
    static getStudentsByFloor(floor: number): Promise<{
        username: string;
        floor: number;
        note: string | null;
        telegramId: string | null;
        isFrozen: boolean;
        frozenReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
}
//# sourceMappingURL=studentService.d.ts.map