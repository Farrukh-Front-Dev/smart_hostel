import express from 'express';
import axios from 'axios';
import { DutyService } from '../services/dutyService';

const router = express.Router();

// Get duties for today
router.get('/today', async (req, res, next) => {
  try {
    const today = new Date();
    await DutyService.ensureDutyForDate(today);
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
    await DutyService.ensureDutyForDate(tomorrow);
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

    await DutyService.ensureDutyForDate(date);
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

    const diffDays = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays >= 0 && diffDays <= 31) {
      await DutyService.ensureDutyWindow(start, diffDays);
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

// Manual send - trigger bot to send duties now
router.post('/send-now', async (req, res, next) => {
  try {
    const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3001';
    
    console.log('[BACKEND] Sending manual notification to bot:', BOT_API_URL);
    
    // Trigger bot to send duties
    const response = await axios.post(`${BOT_API_URL}/api/notify/duties`, {}, {
      timeout: 10000 // 10 seconds timeout
    });
    
    console.log('[BACKEND] Bot response:', response.data);
    
    res.json({ 
      success: true, 
      message: 'Xabar Telegram guruhga yuborildi!',
      data: response.data 
    });
  } catch (error: any) {
    console.error('[BACKEND] Error sending manual notification:', error.message);
    console.error('[BACKEND] Error details:', error.response?.data || error);
    
    res.status(500).json({ 
      success: false, 
      error: 'Xabar yuborishda xatolik yuz berdi',
      details: error.response?.data?.error || error.message 
    });
  }
});

export default router;
