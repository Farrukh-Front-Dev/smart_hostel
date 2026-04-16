import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3003';
const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function startKeepAlive() {
  setInterval(async () => {
    try {
      await axios.get(`${BACKEND_URL}/health`);
      console.log('[KEEP-ALIVE] Backend pinged successfully');
    } catch (error) {
      console.error('[KEEP-ALIVE] Failed to ping backend:', error);
    }
  }, KEEP_ALIVE_INTERVAL);
}
