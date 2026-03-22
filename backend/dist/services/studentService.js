"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class StudentService {
    /**
     * Create a new student
     */
    static async createStudent(data) {
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
    static async getAllStudents(floor) {
        return prisma.student.findMany({
            where: floor ? { floor } : undefined,
            orderBy: { username: 'asc' },
        });
    }
    /**
     * Get student by ID
     */
    static async getStudentById(id) {
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
    static async updateStudent(id, data) {
        return prisma.student.update({
            where: { id },
            data,
        });
    }
    /**
     * Freeze student (mark as unavailable)
     */
    static async freezeStudent(id, reason) {
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
    static async unfreezeStudent(id) {
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
    static async deleteStudent(id) {
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
    static async getStudentsByFloor(floor) {
        return prisma.student.findMany({
            where: { floor },
            orderBy: { username: 'asc' },
        });
    }
}
exports.StudentService = StudentService;
//# sourceMappingURL=studentService.js.map