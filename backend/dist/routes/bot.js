"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const botService_1 = require("../services/botService");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Create or get bot session
router.post('/session', async (req, res, next) => {
    try {
        const { studentId, dutyDate } = req.body;
        const session = await botService_1.BotService.getOrCreateSession(studentId, new Date(dutyDate));
        // Get floormates (other students on same floor for same duty)
        const student = await prisma.student.findUnique({
            where: { id: studentId },
        });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const floormates = await prisma.student.findMany({
            where: {
                floor: student.floor,
                isFrozen: false,
                id: { not: studentId },
            },
            select: { id: true, username: true },
        });
        res.json({
            id: session.id,
            studentId: session.studentId,
            dutyDate: session.dutyDate,
            step: session.step,
            floormates,
        });
    }
    catch (error) {
        next(error);
    }
});
// Update bot session
router.patch('/session/:sessionId', async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const { step, nickname, photoCount, messageIds } = req.body;
        const session = await botService_1.BotService.updateSessionStep(parseInt(sessionId), step, {
            nickname,
            photoCount,
            messageIds,
        });
        res.json(session);
    }
    catch (error) {
        next(error);
    }
});
// Submit duty report
router.post('/submit-report', async (req, res, next) => {
    try {
        const { sessionId, studentId, dutyDate, nickname, photoCount, photoFileIds } = req.body;
        // Complete session
        await botService_1.BotService.completeSession(parseInt(sessionId));
        // Create report
        const report = await prisma.report.create({
            data: {
                studentId,
                dutyDate: new Date(dutyDate),
                photoCount,
                status: 'pending',
            },
        });
        res.json({
            success: true,
            reportId: report.id,
            message: 'Report submitted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
// Get active sessions for a date
router.get('/sessions/:date', async (req, res, next) => {
    try {
        const { date } = req.params;
        const sessions = await botService_1.BotService.getActiveSessionsForDate(new Date(date));
        res.json(sessions);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=bot.js.map