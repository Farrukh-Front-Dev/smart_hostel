import express from 'express';
import { Telegraf, Context } from 'telegraf';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

/**
 * Setup notification endpoint for backend to trigger bot actions
 */
export function setupNotificationEndpoint(app: express.Application, bot: Telegraf<Context>) {
  // Endpoint to post today's duties to Telegram group
  app.post('/api/notify/duties', async (req, res) => {
    try {
      console.log('[BOT] Received manual send request');
      
      if (!TELEGRAM_GROUP_ID) {
        console.error('[BOT] TELEGRAM_GROUP_ID not set');
        return res.status(400).json({ 
          success: false,
          error: 'TELEGRAM_GROUP_ID not configured. Please set it in bot/.env file' 
        });
      }

      console.log('[BOT] Fetching today\'s duties from backend...');
      
      // Fetch today's duties
      const response = await axios.get(`${BACKEND_URL}/api/duties/today`);
      const duties = response.data;

      console.log('[BOT] Duties fetched:', duties);

      // Format message in Russian and Uzbek
      const today = new Date();
      const dateStr = today.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      let message = `Дежурные по общежитию на ${dateStr} г.:\n\n`;

      for (const floor in duties.byFloor) {
        const students = duties.byFloor[floor];
        if (students.length > 0) {
          const floorNum = parseInt(floor);
          message += `${floorNum}-й этаж — ${students.map((s: any) => s.username || s.name).join(', ')}\n`;
        }
      }

      message += `\n╚══════╝\n\n`;
      message += `${dateStr}y. kuni uchun yotoqxona navbatchilari:\n\n`;

      for (const floor in duties.byFloor) {
        const students = duties.byFloor[floor];
        if (students.length > 0) {
          const floorNum = parseInt(floor);
          message += `${floorNum}-etaj — ${students.map((s: any) => s.username || s.name).join(', ')}\n`;
        }
      }

      console.log('[BOT] Sending message to Telegram group:', TELEGRAM_GROUP_ID);
      console.log('[BOT] Message:', message);

      // Send to Telegram group
      await bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message);

      console.log('[BOT] Message sent successfully');

      // Update duty status to posted
      try {
        await axios.patch(`${BACKEND_URL}/api/duties/today/status`, {
          status: 'posted',
        });
        console.log('[BOT] Duty status updated to posted');
      } catch (statusError) {
        console.error('[BOT] Failed to update duty status:', statusError);
        // Don't fail the whole request if status update fails
      }

      res.json({ success: true, message: 'Duties posted to Telegram' });
    } catch (error: any) {
      console.error('[BOT] Error posting duties:', error.message);
      console.error('[BOT] Error stack:', error.stack);
      res.status(500).json({ 
        success: false,
        error: error.message,
        details: error.response?.data || 'Unknown error'
      });
    }
  });

  // Create bot session
  app.post('/api/bot/session', async (req, res) => {
    try {
      const { studentId, dutyDate } = req.body;

      const response = await axios.post(`${BACKEND_URL}/api/bot/session`, {
        studentId,
        dutyDate,
      });

      res.json(response.data);
    } catch (error: any) {
      console.error('[BOT] Error creating session:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Update bot session
  app.patch('/api/bot/session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const response = await axios.patch(`${BACKEND_URL}/api/bot/session/${sessionId}`, req.body);
      res.json(response.data);
    } catch (error: any) {
      console.error('[BOT] Error updating session:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Submit duty report
  app.post('/api/bot/submit-report', async (req, res) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/bot/submit-report`, req.body);
      res.json(response.data);
    } catch (error: any) {
      console.error('[BOT] Error submitting report:', error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'telegram-bot' });
  });
}
