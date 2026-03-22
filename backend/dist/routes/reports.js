"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reportService_1 = require("../services/reportService");
const router = express_1.default.Router();
// Get reports for today
router.get('/today', async (req, res, next) => {
    try {
        const today = new Date();
        const reports = await reportService_1.ReportService.getReportsForDate(today);
        res.json(reports);
    }
    catch (error) {
        next(error);
    }
});
// Get pending reports
router.get('/pending', async (req, res, next) => {
    try {
        const reports = await reportService_1.ReportService.getPendingReports();
        res.json(reports);
    }
    catch (error) {
        next(error);
    }
});
// Get reports for a date
router.get('/date/:date', async (req, res, next) => {
    try {
        const date = new Date(req.params.date);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        const reports = await reportService_1.ReportService.getReportsForDate(date);
        res.json(reports);
    }
    catch (error) {
        next(error);
    }
});
// Get reports for a student
router.get('/student/:studentId', async (req, res, next) => {
    try {
        const reports = await reportService_1.ReportService.getReportsForStudent(parseInt(req.params.studentId));
        res.json(reports);
    }
    catch (error) {
        next(error);
    }
});
// Get report by ID
router.get('/:id', async (req, res, next) => {
    try {
        const report = await reportService_1.ReportService.getReportById(parseInt(req.params.id));
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(report);
    }
    catch (error) {
        next(error);
    }
});
// Create report
router.post('/', async (req, res, next) => {
    try {
        const { studentId, dutyDate, photoUrl } = req.body;
        if (!studentId || !dutyDate || !photoUrl) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const report = await reportService_1.ReportService.createReport({
            studentId: parseInt(studentId),
            dutyDate: new Date(dutyDate),
            photoUrl,
        });
        res.status(201).json(report);
    }
    catch (error) {
        next(error);
    }
});
// Approve report
router.post('/:id/approve', async (req, res, next) => {
    try {
        const report = await reportService_1.ReportService.approveReport(parseInt(req.params.id));
        res.json(report);
    }
    catch (error) {
        next(error);
    }
});
// Reject report
router.post('/:id/reject', async (req, res, next) => {
    try {
        const { notes } = req.body;
        const report = await reportService_1.ReportService.rejectReport(parseInt(req.params.id), notes);
        res.json(report);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=reports.js.map