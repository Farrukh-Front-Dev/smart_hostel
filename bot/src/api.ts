import express from 'express';
import { Telegraf, Context } from 'telegraf';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

/**
 * Generate simple duty message format with user mentions (using School21 nick)
 */
function generateSimpleMessage(duties: any, dateStr: string): string {
  let message = `📅 _${dateStr}_\n`;
  message += `━━━━━━━━━\n`;

  for (const floor in duties.byFloor) {
    const students = duties.byFloor[floor];
    const floorNum = parseInt(floor);
    
    message += `_${floorNum}-qavat:_\n`;
    
    if (students.length > 0) {
      students.forEach((s: any) => {
        // Always use username (School21 nick), with mention if telegramId exists
        if (s.telegramId) {
          message += `• [${s.username}](tg://user?id=${s.telegramId})\n`;
        } else {
          message += `• *${s.username}*\n`;
        }
      });
    } else {
      message += `• _INTENSIV_\n`;
    }
    message += `━━━━━━━━━\n`;
  }

  return message;
}

/**
 * Generate timed duty message format (3 shifts per floor) with user mentions (using School21 nick)
 */
function generateTimedMessage(duties: any, dateStr: string): string {
  let message = `📅 _${dateStr}_\n`;
  message += `━━━━━━━━━\n`;

  const shifts = [
    { name: 'Tong', time: '10:00-15:00' },
    { name: 'Kun', time: '15:00-20:00' },
    { name: 'Kech', time: '23:00-04:00' }
  ];

  for (const floor in duties.byFloor) {
    const students = duties.byFloor[floor];
    const floorNum = parseInt(floor);
    
    message += `_${floorNum}-qavat_\n`;
    
    if (students.length > 0) {
      // Distribute students across 3 shifts
      for (let i = 0; i < shifts.length; i++) {
        const student = students[i] || students[0];
        message += `_${shifts[i].name}_ ${shifts[i].time}\n`;
        
        // Always use username (School21 nick), with mention if telegramId exists
        if (student.telegramId) {
          message += `[${student.username}](tg://user?id=${student.telegramId})\n`;
        } else {
          message += `*${student.username}*\n`;
        }
      }
    } else {
      message += `_INTENSIV_\n`;
    }
    message += `━━━━━━━━━\n`;
  }

  return message;
}

/**
 * Setup notification endpoint for backend to trigger bot actions
 */
export function setupNotificationEndpoint(app: express.Application, bot: Telegraf<Context>) {
  // Endpoint to post today's duties to Telegram group
  app.post('/api/notify/duties', async (req, res) => {
    try {
      console.log('[BOT] Received manual send request');
      
      // Read environment variables at runtime
      const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
      const TELEGRAM_DUTY_GROUP_ID = process.env.TELEGRAM_DUTY_GROUP_ID;
      
      console.log('[BOT] Using BACKEND_URL:', BACKEND_URL);
      console.log('[BOT] Using TELEGRAM_DUTY_GROUP_ID:', TELEGRAM_DUTY_GROUP_ID);
      
      if (!TELEGRAM_DUTY_GROUP_ID) {
        console.error('[BOT] TELEGRAM_DUTY_GROUP_ID not set');
        return res.status(400).json({ 
          success: false,
          error: 'TELEGRAM_DUTY_GROUP_ID not configured. Please set it in bot/.env file' 
        });
      }

      console.log('[BOT] Fetching today\'s duties from backend...');
      
      // Fetch today's duties
      const response = await axios.get(`${BACKEND_URL}/api/duties/today`);
      const duties = response.data;

      console.log('[BOT] Duties fetched:', duties);

      // Get message format setting
      let messageFormat = 'simple';
      try {
        const formatResponse = await axios.get(`${BACKEND_URL}/api/settings/duty_message_format`);
        messageFormat = formatResponse.data.value || 'simple';
      } catch (error) {
        console.log('[BOT] Using default format: simple');
      }

      // Get post with image setting
      let postWithImage = true;
      try {
        const imageResponse = await axios.get(`${BACKEND_URL}/api/settings/post_with_image`);
        postWithImage = imageResponse.data.value === 'true' || imageResponse.data.value === true;
      } catch (error) {
        console.log('[BOT] Using default: post with image');
      }

      const today = new Date();
      const dateStr = today.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      // Generate message based on format
      const message = messageFormat === 'timed' 
        ? generateTimedMessage(duties, dateStr)
        : generateSimpleMessage(duties, dateStr);

      console.log('[BOT] Sending message to Telegram group:', TELEGRAM_DUTY_GROUP_ID);
      console.log('[BOT] Message format:', messageFormat);
      console.log('[BOT] Post with image:', postWithImage);
      console.log('[BOT] Message:', message);

      // Path to the hostel image
      const imagePath = path.join(__dirname, '..', 'school21Hostel.png');
      
      // Send based on postWithImage setting
      if (postWithImage && fs.existsSync(imagePath)) {
        console.log('[BOT] Sending photo with caption...');
        // Send photo with caption to Telegram group (with Markdown parse mode)
        await bot.telegram.sendPhoto(TELEGRAM_DUTY_GROUP_ID, {
          source: imagePath
        }, {
          caption: message,
          parse_mode: 'Markdown'
        });
        console.log('[BOT] Photo with message sent successfully');
      } else {
        console.log('[BOT] Sending text only...');
        // Send text message only
        await bot.telegram.sendMessage(TELEGRAM_DUTY_GROUP_ID, message, {
          parse_mode: 'Markdown'
        });
        console.log('[BOT] Text message sent successfully');
      }

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

      res.json({ success: true, message: 'Duties posted to Telegram', format: messageFormat, withImage: postWithImage });
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

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'telegram-bot' });
  });
}
