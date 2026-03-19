import cron from 'node-cron';
import { DutyService } from '../services/dutyService';
import axios from 'axios';

/**
 * Initialize all scheduled tasks
 */
export function initializeScheduler() {
  // Generate duties every day at 08:00
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('[CRON] Generating duties for today...');
      const today = new Date();
      await DutyService.generateDutiesForDate(today);

      // Notify bot to post duties
      await notifyBotToDuties();
    } catch (error) {
      console.error('[CRON] Error generating duties:', error);
    }
  });

  console.log('✓ Cron jobs initialized');
}

/**
 * Notify bot to post today's duties to Telegram
 */
async function notifyBotToDuties() {
  try {
    const botUrl = process.env.BOT_API_URL || 'http://localhost:3001';
    await axios.post(`${botUrl}/api/notify/duties`, {
      timestamp: new Date().toISOString(),
    });
    console.log('[CRON] Bot notified to post duties');
  } catch (error) {
    console.error('[CRON] Failed to notify bot:', error);
  }
}
