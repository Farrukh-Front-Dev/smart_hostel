import express from 'express';
import { DutyService } from '../services/dutyService';

const router = express.Router();

// Get duties for today
router.get('/today', async (req, res, next) => {
  try {
    const today = new Date();
    const duties = await DutyService.getDutiesForDate(today);

    if (!duties) {
      return res.status(404).json({ error: 'No duties for today' });
    }

    res.json(duties);
  } catch (error) {
    next(error);
  }
});

// Get duties for tomorrow
router.get('/tomorrow', async (req, res, next) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const duties = await DutyService.getDutiesForDate(tomorrow);

    if (!duties) {
      return res.status(404).json({ error: 'No duties for tomorrow' });
    }

    res.json(duties);
  } catch (error) {
    next(error);
  }
});

// Get duties for a specific date
router.get('/date/:date', async (req, res, next) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const duties = await DutyService.getDutiesForDate(date);

    if (!duties) {
      return res.status(404).json({ error: 'No duties for this date' });
    }

    res.json(duties);
  } catch (error) {
    next(error);
  }
});

// Get duties for a date range
router.get('/range', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const duties = await DutyService.getDutiesForRange(start, end);
    res.json(duties);
  } catch (error) {
    next(error);
  }
});

// Update duty status
router.patch('/today/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const today = new Date();
    const duties = await DutyService.getDutiesForDate(today);

    if (!duties) {
      return res.status(404).json({ error: 'No duties for today' });
    }

    await DutyService.updateDutyStatus(duties.id, status);
    res.json({ message: 'Duty status updated' });
  } catch (error) {
    next(error);
  }
});

// Generate duties for a specific date (admin only)
router.post('/generate/:date', async (req, res, next) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    await DutyService.generateDutiesForDate(date);
    res.json({ message: 'Duties generated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
