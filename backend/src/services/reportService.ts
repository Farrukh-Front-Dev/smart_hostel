import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportService {
  /**
   * Create a report (photo upload)
   */
  static async createReport(data: {
    studentId: number;
    dutyDate: Date;
    photoUrl: string;
  }) {
    return prisma.report.create({
      data: {
        ...data,
        status: 'pending',
      },
      include: {
        student: true,
      },
    });
  }

  /**
   * Get reports for a specific date
   */
  static async getReportsForDate(date: Date) {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return prisma.report.findMany({
      where: { 
        dutyDate: {
          gte: dateOnly,
          lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000),
        }
      },
      include: {
        student: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get reports for a student
   */
  static async getReportsForStudent(studentId: number) {
    return prisma.report.findMany({
      where: { studentId },
      include: {
        student: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all pending reports
   */
  static async getPendingReports() {
    return prisma.report.findMany({
      where: { status: 'pending' },
      include: {
        student: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Approve a report
   */
  static async approveReport(id: number) {
    return prisma.report.update({
      where: { id },
      data: { status: 'approved' },
      include: {
        student: true,
      },
    });
  }

  /**
   * Reject a report
   */
  static async rejectReport(id: number, notes?: string) {
    return prisma.report.update({
      where: { id },
      data: {
        status: 'rejected',
        notes,
      },
      include: {
        student: true,
      },
    });
  }

  /**
   * Get report by ID
   */
  static async getReportById(id: number) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        student: true,
      },
    });
  }

  /**
   * Get reports for date range
   */
  static async getReportsForRange(startDate: Date, endDate: Date, status?: string) {
    return prisma.report.findMany({
      where: {
        dutyDate: {
          gte: startDate,
          lte: endDate,
        },
        ...(status && { status }),
      },
      include: {
        student: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
