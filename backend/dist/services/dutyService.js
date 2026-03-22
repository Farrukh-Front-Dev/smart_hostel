"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DutyService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Duty generation algorithm:
 * - 3 students per floor per day
 * - 4 floors total
 * - Uses rotation queue to ensure fair distribution
 * - Skips frozen students
 */
class DutyService {
    /**
     * Generate duties for a specific date
     * Assigns 3 students per floor (12 total students per day)
     */
    static async generateDutiesForDate(date) {
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        // Check if duties already exist for this date
        const existingDuty = await prisma.duty.findUnique({
            where: { date: dateOnly },
        });
        if (existingDuty) {
            console.log(`Duties already exist for ${dateOnly.toISOString().split('T')[0]}`);
            return existingDuty;
        }
        // Create duty record
        const duty = await prisma.duty.create({
            data: { date: dateOnly, status: 'pending' },
        });
        // Generate assignments for each floor
        for (let floor = 1; floor <= 4; floor++) {
            const assignedStudents = await this.assignStudentsToFloor(floor, 3);
            // Create DutyStudent records
            for (const student of assignedStudents) {
                await prisma.dutyStudent.create({
                    data: {
                        dutyId: duty.id,
                        studentId: student.id,
                        floor: floor,
                    },
                });
                // Update rotation queue
                await prisma.rotationQueue.update({
                    where: { studentId: student.id },
                    data: {
                        lastAssignedDate: dateOnly,
                        priority: 0,
                    },
                });
            }
        }
        console.log(`✓ Duties generated for ${dateOnly.toISOString().split('T')[0]}`);
        return duty;
    }
    /**
     * Assign 3 students to a specific floor
     * Uses rotation queue to ensure fair distribution
     */
    static async assignStudentsToFloor(floor, count) {
        // Get all non-frozen students on this floor
        const availableStudents = await prisma.student.findMany({
            where: {
                floor: floor,
                isFrozen: false,
            },
        });
        if (availableStudents.length < count) {
            throw new Error(`Not enough available students on floor ${floor}`);
        }
        // Get rotation queue for these students
        const rotationQueues = await prisma.rotationQueue.findMany({
            where: {
                studentId: {
                    in: availableStudents.map(s => s.id),
                },
            },
        });
        // Create a map for quick lookup
        const queueMap = new Map(rotationQueues.map(q => [q.studentId, q]));
        // Sort by priority (lower = higher priority) and last assigned date
        const sorted = availableStudents.sort((a, b) => {
            const queueA = queueMap.get(a.id);
            const queueB = queueMap.get(b.id);
            const priorityDiff = (queueA?.priority || 0) - (queueB?.priority || 0);
            if (priorityDiff !== 0)
                return priorityDiff;
            const dateA = queueA?.lastAssignedDate?.getTime() || 0;
            const dateB = queueB?.lastAssignedDate?.getTime() || 0;
            return dateA - dateB;
        });
        // Select top 'count' students
        const selected = sorted.slice(0, count);
        // Increment priority for non-selected students (they wait longer)
        const nonSelected = sorted.slice(count);
        for (const student of nonSelected) {
            const queue = queueMap.get(student.id);
            if (queue) {
                await prisma.rotationQueue.update({
                    where: { id: queue.id },
                    data: { priority: (queue.priority || 0) + 1 },
                });
            }
        }
        return selected;
    }
    /**
     * Get duties for a specific date with students
     */
    static async getDutiesForDate(date) {
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const duty = await prisma.duty.findUnique({
            where: { date: dateOnly },
            include: {
                students: {
                    include: {
                        student: true,
                    },
                },
            },
        });
        if (!duty)
            return null;
        // Group by floor
        const byFloor = {};
        for (let i = 1; i <= 4; i++) {
            byFloor[i] = [];
        }
        duty.students.forEach((ds) => {
            byFloor[ds.floor].push(ds.student);
        });
        return {
            id: duty.id,
            date: duty.date,
            status: duty.status,
            byFloor,
            allStudents: duty.students.map((ds) => ds.student),
        };
    }
    /**
     * Get duties for a date range
     */
    static async getDutiesForRange(startDate, endDate) {
        const duties = await prisma.duty.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                students: {
                    include: {
                        student: true,
                    },
                },
            },
            orderBy: { date: 'asc' },
        });
        return duties.map((duty) => {
            const byFloor = {};
            for (let i = 1; i <= 4; i++) {
                byFloor[i] = [];
            }
            duty.students.forEach((ds) => {
                byFloor[ds.floor].push(ds.student);
            });
            return {
                id: duty.id,
                date: duty.date,
                status: duty.status,
                byFloor,
                allStudents: duty.students.map((ds) => ds.student),
            };
        });
    }
    /**
     * Update duty status
     */
    static async updateDutyStatus(dutyId, status) {
        return prisma.duty.update({
            where: { id: dutyId },
            data: { status },
        });
    }
}
exports.DutyService = DutyService;
//# sourceMappingURL=dutyService.js.map