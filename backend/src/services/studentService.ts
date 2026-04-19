import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StudentService {
  /**
   * Create a new student
   */
  static async createStudent(data: {
    username: string;
    floor: number;
    room?: string;
    fullName?: string;
    note?: string;
  }) {
    const student = await prisma.student.create({
      data,
    });

    // Initialize rotation queue
    await prisma.rotationQueue.create({
      data: {
        studentId: student.id,
        floor: student.floor,
        priority: 0,
      },
    });

    return student;
  }

  /**
   * Get all students
   */
  static async getAllStudents(floor?: number) {
    return prisma.student.findMany({
      where: floor ? { floor } : undefined,
      orderBy: { username: 'asc' },
    });
  }

  /**
   * Get student by ID
   */
  static async getStudentById(id: string) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        duties: {
          include: {
            duty: true,
          },
        },
      },
    });
  }

  /**
   * Update student
   */
  static async updateStudent(id: string, data: Partial<{
    username: string;
    floor: number;
    room: string;
    fullName: string;
    note: string;
  }>) {
    return prisma.student.update({
      where: { id },
      data,
    });
  }

  /**
   * Freeze student (mark as unavailable)
   */
  static async freezeStudent(id: string, reason: string) {
    return prisma.student.update({
      where: { id },
      data: {
        isFrozen: true,
        frozenReason: reason,
      },
    });
  }

  /**
   * Unfreeze student
   */
  static async unfreezeStudent(id: string) {
    return prisma.student.update({
      where: { id },
      data: {
        isFrozen: false,
        frozenReason: null,
      },
    });
  }

  /**
   * Delete student
   */
  static async deleteStudent(id: string) {
    // Delete related records first
    await prisma.rotationQueue.deleteMany({
      where: { studentId: id },
    });

    return prisma.student.delete({
      where: { id },
    });
  }

  /**
   * Get students by floor
   */
  static async getStudentsByFloor(floor: number) {
    return prisma.student.findMany({
      where: { floor },
      orderBy: { username: 'asc' },
    });
  }
}
