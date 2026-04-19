import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DUTY_TIMEZONE_OFFSET_MS = 5 * 60 * 60 * 1000;

/**
 * Duty generation algorithm:
 * - 3 active (non-frozen) peers per floor per day
 * - 4 floors total (12 total peers per day)
 * - Uses sequential circular rotation through the list
 * - Day 1: Peers 1,2,3 -> Day 2: Peers 4,5,6 -> ... -> Day 10: Peers 28,29,30 -> Day 11: Peers 1,2,3 (wraps)
 * - Skips frozen peers automatically
 */
export class DutyService {
  private static normalizeDutyDate(date: Date): Date {
    const shifted = new Date(date.getTime() + DUTY_TIMEZONE_OFFSET_MS);

    return new Date(
      Date.UTC(
        shifted.getUTCFullYear(),
        shifted.getUTCMonth(),
        shifted.getUTCDate()
      ) - DUTY_TIMEZONE_OFFSET_MS
    );
  }

  private static formatDutyDate(date: Date): string {
    return new Date(date.getTime() + DUTY_TIMEZONE_OFFSET_MS)
      .toISOString()
      .split('T')[0];
  }

  static async ensureDutyForDate(date: Date) {
    const dateOnly = this.normalizeDutyDate(date);
    const existingDuty = await prisma.duty.findUnique({
      where: { date: dateOnly },
    });

    if (existingDuty) {
      return existingDuty;
    }

    return this.generateDutiesForDate(date);
  }

  static async ensureDutyWindow(startDate: Date, daysAhead: number) {
    for (let day = 0; day <= daysAhead; day++) {
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + day);
      await this.ensureDutyForDate(targetDate);
    }
  }

  /**
   * Generate duties for a specific date
   * Assigns 3 students per floor (12 total students per day)
   */
  static async generateDutiesForDate(date: Date): Promise<any> {
    const dateOnly = this.normalizeDutyDate(date);

    // Check if duties already exist for this date
    const existingDuty = await prisma.duty.findUnique({
      where: { date: dateOnly },
    });

    if (existingDuty) {
      console.log(`Duties already exist for ${this.formatDutyDate(dateOnly)}`);
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

    console.log(`✓ Duties generated for ${this.formatDutyDate(dateOnly)}`);
    return duty;
  }

  /**
   * Assign 3 students to a specific floor using sequential circular rotation
   * Cycles through the list sequentially: 1,2,3 -> 4,5,6 -> ... -> wraps around
   * Returns empty array if no students available (will show as INTENSIV)
   */
  private static async assignStudentsToFloor(floor: number, count: number) {
    // Get all non-frozen students on this floor, sorted by ID for consistency
    const availableStudents = await prisma.student.findMany({
      where: {
        floor: floor,
        isFrozen: false,
      },
      orderBy: { id: 'asc' },
    });

    // If no students available, return empty array (will be marked as INTENSIV)
    if (availableStudents.length === 0) {
      return [];
    }

    // If fewer students than needed, return all available
    if (availableStudents.length < count) {
      return availableStudents;
    }

    // Get rotation queue for these students to find the starting position
    const rotationQueues = await prisma.rotationQueue.findMany({
      where: {
        studentId: {
          in: availableStudents.map(s => s.id),
        },
      },
    });

    // Keep explicit Map typing so stricter TS inference doesn't collapse values to unknown
    const queueMap = new Map<string, (typeof rotationQueues)[number]>();
    rotationQueues.forEach((queue) => {
      queueMap.set(queue.studentId, queue);
    });

    // Find the student with the oldest lastAssignedDate to determine rotation position
    let startIndex = 0;
    let oldestDate = new Date().getTime();

    for (let i = 0; i < availableStudents.length; i++) {
      const queue = queueMap.get(availableStudents[i].id);
      const assignedDate = queue?.lastAssignedDate?.getTime() || 0;
      
      if (assignedDate < oldestDate) {
        oldestDate = assignedDate;
        startIndex = i;
      }
    }

    // Move to the next position in the circular list
    startIndex = (startIndex + count) % availableStudents.length;

    // Select 'count' students starting from startIndex, wrapping around if needed
    const selected = [];
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % availableStudents.length;
      selected.push(availableStudents[index]);
    }

    return selected;
  }

  /**
   * Get duties for a specific date with students
   */
  static async getDutiesForDate(date: Date) {
    const dateOnly = this.normalizeDutyDate(date);

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

    if (!duty) return null;

    // Group by floor
    const byFloor: Record<number, any[]> = {};
    for (let i = 1; i <= 4; i++) {
      byFloor[i] = [];
    }

    duty.students.forEach((ds: any) => {
      byFloor[ds.floor].push(ds.student);
    });

    return {
      id: duty.id,
      date: this.formatDutyDate(duty.date),
      status: duty.status,
      byFloor,
      allStudents: duty.students.map((ds: any) => ds.student),
    };
  }

  /**
   * Get duties for a date range
   */
  static async getDutiesForRange(startDate: Date, endDate: Date) {
    const normalizedStartDate = this.normalizeDutyDate(startDate);
    const normalizedEndDate = this.normalizeDutyDate(endDate);

    const duties = await prisma.duty.findMany({
      where: {
        date: {
          gte: normalizedStartDate,
          lte: normalizedEndDate,
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

    return duties.map((duty: any) => {
      const byFloor: Record<number, any[]> = {};
      for (let i = 1; i <= 4; i++) {
        byFloor[i] = [];
      }

      duty.students.forEach((ds: any) => {
        byFloor[ds.floor].push(ds.student);
      });

      return {
        id: duty.id,
        date: this.formatDutyDate(duty.date),
        status: duty.status,
        byFloor,
        allStudents: duty.students.map((ds: any) => ds.student),
      };
    });
  }

  /**
   * Update duty status
   */
  static async updateDutyStatus(dutyId: string, status: string) {
    return prisma.duty.update({
      where: { id: dutyId },
      data: { status },
    });
  }
}
