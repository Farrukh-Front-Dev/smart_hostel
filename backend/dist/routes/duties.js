"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dutyService_1 = require("../services/dutyService");
const router = express_1.default.Router();
// Get duties for today
router.get('/today', async (req, res, next) => {
    try {
        const today = new Date();
        const duties = await dutyService_1.DutyService.getDutiesForDate(today);
        if (!duties) {
            return res.status(404).json({ error: 'No duties for today' });
        }
        res.json(duties);
    }
    catch (error) {
        next(error);
    }
});
// Get duties for tomorrow
router.get('/tomorrow', async (req, res, next) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const duties = await dutyService_1.DutyService.getDutiesForDate(tomorrow);
        if (!duties) {
            return res.status(404).json({ error: 'No duties for tomorrow' });
        }
        res.json(duties);
    }
    catch (error) {
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
        const duties = await dutyService_1.DutyService.getDutiesForDate(date);
        if (!duties) {
            return res.status(404).json({ error: 'No duties for this date' });
        }
        res.json(duties);
    }
    catch (error) {
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
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        const duties = await dutyService_1.DutyService.getDutiesForRange(start, end);
        res.json(duties);
    }
    catch (error) {
        next(error);
    }
});
// Update duty status
router.patch('/today/status', async (req, res, next) => {
    try {
        const { status } = req.body;
        const today = new Date();
        const duties = await dutyService_1.DutyService.getDutiesForDate(today);
        if (!duties) {
            return res.status(404).json({ error: 'No duties for today' });
        }
        await dutyService_1.DutyService.updateDutyStatus(duties.id, status);
        res.json({ message: 'Duty status updated' });
    }
    catch (error) {
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
        await dutyService_1.DutyService.generateDutiesForDate(date);
        res.json({ message: 'Duties generated successfully' });
    }
    catch (error) {
        next(error);
    }
});
// Manual send - trigger bot to send duties now
router.post('/send-now', async (req, res, next) => {
    try {
        const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3001';
        console.log('[BACKEND] Sending manual notification to bot:', BOT_API_URL);
        // Trigger bot to send duties
        const response = await axios_1.default.post(`${BOT_API_URL}/api/notify/duties`, {}, {
            timeout: 10000 // 10 seconds timeout
        });
        console.log('[BACKEND] Bot response:', response.data);
        res.json({
            success: true,
            message: 'Xabar Telegram guruhga yuborildi!',
            data: response.data
        });
    }
    catch (error) {
        console.error('[BACKEND] Error sending manual notification:', error.message);
        console.error('[BACKEND] Error details:', error.response?.data || error);
        res.status(500).json({
            success: false,
            error: 'Xabar yuborishda xatolik yuz berdi',
            details: error.response?.data?.error || error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=duties.js.map