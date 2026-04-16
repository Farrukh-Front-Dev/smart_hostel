import express from 'express';
import axios from 'axios';

const router = express.Router();

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline';
  responseTime: number;
  lastChecked: string;
}

// Check backend status
router.get('/backend', (req, res) => {
  const status: ServiceStatus = {
    name: 'Backend',
    status: 'online',
    responseTime: 0,
    lastChecked: new Date().toISOString(),
  };
  res.json(status);
});

// Check bot status
router.get('/bot', async (req, res) => {
  try {
    const botUrl = process.env.BOT_URL || 'http://localhost:3004';
    const startTime = Date.now();
    
    await axios.get(`${botUrl}/health`, { timeout: 5000 });
    
    const responseTime = Date.now() - startTime;
    const status: ServiceStatus = {
      name: 'Bot',
      status: 'online',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
    res.json(status);
  } catch (error) {
    const status: ServiceStatus = {
      name: 'Bot',
      status: 'offline',
      responseTime: 0,
      lastChecked: new Date().toISOString(),
    };
    res.status(503).json(status);
  }
});

// Check all services
router.get('/all', async (req, res) => {
  const backendStatus: ServiceStatus = {
    name: 'Backend',
    status: 'online',
    responseTime: 0,
    lastChecked: new Date().toISOString(),
  };

  let botStatus: ServiceStatus = {
    name: 'Bot',
    status: 'offline',
    responseTime: 0,
    lastChecked: new Date().toISOString(),
  };

  try {
    const botUrl = process.env.BOT_URL || 'http://localhost:3004';
    const startTime = Date.now();
    
    await axios.get(`${botUrl}/health`, { timeout: 5000 });
    
    botStatus = {
      name: 'Bot',
      status: 'online',
      responseTime: Date.now() - startTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    // Bot is offline
  }

  res.json({
    services: [backendStatus, botStatus],
    timestamp: new Date().toISOString(),
  });
});

export default router;
