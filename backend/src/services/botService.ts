import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BotService {
  /**
   * Create or get bot session for a student
   */
  static async getOrCreateSession(studentId: number, dutyDate: Date) {
    const dateOnly = new Date(dutyDate.getFullYear(), dutyDate.getMonth(), dutyDate.getDate());

    let session = await prisma.botSession.findUnique({
      where: {
        studentId_dutyDate: {
          studentId,
          dutyDate: dateOnly,
        },
      },
    });

    if (!session) {
      session = await prisma.botSession.create({
        data: {
          studentId,
          dutyDate: dateOnly,
          step: 'nickname',
          status: 'active',
        },
      });
    }

    return session;
  }

  /**
   * Update session step
   */
  static async updateSessionStep(sessionId: number, step: string, data?: any) {
    const updateData: any = { step };
    if (data?.nickname) updateData.nickname = data.nickname;
    if (data?.photoCount !== undefined) updateData.photoCount = data.photoCount;
    if (data?.messageIds) updateData.messageIds = JSON.stringify(data.messageIds);

    return prisma.botSession.update({
      where: { id: sessionId },
      data: updateData,
    });
  }

  /**
   * Complete session
   */
  static async completeSession(sessionId: number) {
    return prisma.botSession.update({
      where: { id: sessionId },
      data: { status: 'completed' },
    });
  }

  /**
   * Cancel session
   */
  static async cancelSession(sessionId: number) {
    return prisma.botSession.update({
      where: { id: sessionId },
      data: { status: 'cancelled' },
    });
  }

  /**
   * Get active sessions for a duty date
   */
  static async getActiveSessionsForDate(dutyDate: Date) {
    const dateOnly = new Date(dutyDate.getFullYear(), dutyDate.getMonth(), dutyDate.getDate());

    return prisma.botSession.findMany({
      where: {
        dutyDate: dateOnly,
        status: 'active',
      },
      include: {
        student: true,
      },
    });
  }

  /**
   * Get session by student and date
   */
  static async getSessionByStudentAndDate(studentId: number, dutyDate: Date) {
    const dateOnly = new Date(dutyDate.getFullYear(), dutyDate.getMonth(), dutyDate.getDate());

    return prisma.botSession.findUnique({
      where: {
        studentId_dutyDate: {
          studentId,
          dutyDate: dateOnly,
        },
      },
      include: {
        student: true,
      },
    });
  }
}
