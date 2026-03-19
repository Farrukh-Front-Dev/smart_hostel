import express from 'express';
import { ReportService } from '../services/reportService';

const router = express.Router();

// Get reports for today
router.get('/today', async (req, res, next) => {
  try {
    const today = new Date();
    const reports = await ReportService.getReportsForDate(today);
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Get pending reports
router.get('/pending', async (req, res, next) => {
  try {
    const reports = await ReportService.getPendingReports();
    res.json(reports);
  } catch (error) {
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

    const reports = await ReportService.getReportsForDate(date);
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Get reports for a student
router.get('/student/:studentId', async (req, res, next) => {
  try {
    const reports = await ReportService.getReportsForStudent(parseInt(req.params.studentId));
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Get report by ID
router.get('/:id', async (req, res, next) => {
  try {
    const report = await ReportService.getReportById(parseInt(req.params.id));
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
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

    const report = await ReportService.createReport({
      studentId: parseInt(studentId),
      dutyDate: new Date(dutyDate),
      photoUrl,
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

// Approve report
router.post('/:id/approve', async (req, res, next) => {
  try {
    const report = await ReportService.approveReport(parseInt(req.params.id));
    res.json(report);
  } catch (error) {
    next(error);
  }
});

// Reject report
router.post('/:id/reject', async (req, res, next) => {
  try {
    const { notes } = req.body;
    const report = await ReportService.rejectReport(parseInt(req.params.id), notes);
    res.json(report);
  } catch (error) {
    next(error);
  }
});

export default router;
