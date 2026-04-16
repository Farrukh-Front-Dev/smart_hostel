import axios from 'axios';

const BOT_URL = process.env.BOT_URL || 'http://localhost:3004';
const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function startKeepAlive() {
  setInterval(async () => {
    try {
      await axios.get(`${BOT_URL}/health`);
      console.log('[KEEP-ALIVE] Bot pinged successfully');
    } catch (error) {
      console.error('[KEEP-ALIVE] Failed to ping bot:', error);
    }
  }, KEEP_ALIVE_INTERVAL);
}
