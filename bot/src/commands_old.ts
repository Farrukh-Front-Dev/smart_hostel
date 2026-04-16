import { Telegraf, Context } from 'telegraf';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

// Store user states for payment flow
interface PaymentData {
  school21Nick?: string;
  fullName?: string;
  room?: string;
  month?: string;
  studentId?: number;
  fileId?: string;
  fileType?: 'photo' | 'document';
  messageIds?: number[];
}

const userStates = new Map<number, { step: string; data: PaymentData }>();

/**
 * Setup bot commands
 */
export function setupCommands(bot: Telegraf<Context>) {
  // /start command
  bot.start((ctx) => {
    ctx.reply(
      `👋 SmartHostel Botiga xush kelibsiz!\n\n` +
        `Mavjud buyruqlar:\n` +
        `/today - Bugungi navbatchiliklar\n` +
        `/tomorrow - Ertangi navbatchiliklar\n` +
        `/payment - Hostel to'lovini yuborish\n` +
        `/help - Yordam`
    );
  });

  // /help command
  bot.help((ctx) => {
    ctx.reply(
      `📋 SmartHostel Buyruqlari:\n\n` +
        `/today - Bugungi navbatchiliklar\n` +
        `/tomorrow - Ertangi navbatchiliklar\n` +
        `/payment - Hostel to'lovini yuborish\n` +
        `/help - Yordam`
    );
  });

  // /today command
  bot.command('today', async (ctx) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/duties/today`);
      const duties = response.data;

      let message = `📅 Today's Duty Assignments\n\n`;

      for (const floor in duties.byFloor) {
        const students = duties.byFloor[floor];
        if (students.length > 0) {
          message += `🏢 Floor ${floor}:\n`;
          students.forEach((student: any) => {
            message += `  • ${student.name} (${student.rollNo})\n`;
          });
          message += '\n';
        }
      }

      await ctx.reply(message);
    } catch (error: any) {
      console.error('[BOT] Error fetching today duties:', error.message);
      await ctx.reply('❌ Could not fetch today\'s duties. Please try again later.');
    }
  });

  // /tomorrow command
  bot.command('tomorrow', async (ctx) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/duties/tomorrow`);
      const duties = response.data;

      let message = `📅 Tomorrow's Duty Assignments\n\n`;

      for (const floor in duties.byFloor) {
        const students = duties.byFloor[floor];
        if (students.length > 0) {
          message += `🏢 Floor ${floor}:\n`;
          students.forEach((student: any) => {
            message += `  • ${student.name} (${student.rollNo})\n`;
          });
          message += '\n';
        }
      }

      await ctx.reply(message);
    } catch (error: any) {
      console.error('[BOT] Error fetching tomorrow duties:', error.message);
      await ctx.reply('❌ Could not fetch tomorrow\'s duties. Please try again later.');
    }
  });

  // /groupid command - shows the current chat/group ID
  bot.command('groupid', async (ctx) => {
    const chatId = ctx.chat?.id;
    const chatType = ctx.chat?.type;
    const chatTitle = (ctx.chat as any)?.title || 'Private Chat';
    
    await ctx.reply(
      `📍 Chat Information:\n\n` +
        `Chat ID: <code>${chatId}</code>\n` +
        `Chat Type: ${chatType}\n` +
        `Chat Name: ${chatTitle}\n\n` +
        `Use this ID in your bot configuration.`,
      { parse_mode: 'HTML' }
    );
  });

  // /invite command - generates an invite link for the bot
  bot.command('invite', async (ctx) => {
    const botUsername = (await bot.telegram.getMe()).username;
    const inviteLink = `https://t.me/${botUsername}`;
    
    await ctx.reply(
      `🔗 Bot Invite Link:\n\n` +
        `<a href="${inviteLink}">Click here to add bot to group</a>\n\n` +
        `Or search for: @${botUsername}`,
      { parse_mode: 'HTML' }
    );
  });

  // /test command - sends duties message every second for testing
  let testInterval: NodeJS.Timeout | null = null;
  
  bot.command('test', async (ctx) => {
    if (testInterval) {
      clearInterval(testInterval);
      testInterval = null;
      await ctx.reply('🛑 Test stopped');
      return;
    }

    await ctx.reply('🧪 Starting test - sending duties every second...');

    testInterval = setInterval(async () => {
      try {
        const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
        const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

        if (!TELEGRAM_GROUP_ID) {
          console.error('[BOT] TELEGRAM_GROUP_ID not set');
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/api/duties/today`);
        const duties = response.data;

        const today = new Date();
        const dateStr = today.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        let message = `📅 _${dateStr}y. navbatchilar:_\n`;
        message += `━━━━━━━━━━━━━\n`;

        for (const floor in duties.byFloor) {
          const students = duties.byFloor[floor];
          const floorNum = parseInt(floor);
          
          message += `_${floorNum}-qavat:_\n`;
          
          if (students.length > 0) {
            students.forEach((s: any) => {
              message += `  • *${s.username || s.name}*\n`;
            });
          } else {
            message += `  • _INTENSIV_\n`;
          }
          message += `━━━━━━━━━━━━━\n`;
        }

        // Path to the hostel image
        const imagePath = path.join(__dirname, '..', 'school21Hostel.png');
        
        // Send photo with caption if image exists, otherwise send text
        if (fs.existsSync(imagePath)) {
          await bot.telegram.sendPhoto(TELEGRAM_GROUP_ID, {
            source: imagePath
          }, {
            caption: message,
            parse_mode: 'Markdown'
          });
        } else {
          await bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message, {
            parse_mode: 'Markdown'
          });
        }
        
        console.log('[BOT] Test duties message sent');
      } catch (error) {
        console.error('[BOT] Test error:', error);
      }
    }, 1000); // Send every 1 second
  });

  // /payment command - start payment submission flow
  bot.command('payment', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    try {
      // Get current month
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      // Initialize user state
      userStates.set(userId, {
        step: 'waiting_for_school21_nick',
        data: { month, messageIds: [] }
      });

      const msg = await ctx.reply(
        `💳 Hostel to'lovini yuborish\n\n` +
        `School21 nikingizni kiriting:\n` +
        `Masalan: @farrukh yoki farrukh\n\n` +
        `Bekor qilish uchun /cancel`
      );
      
      // Save message ID to delete later
      const userState = userStates.get(userId);
      if (userState) {
        userState.data.messageIds = [msg.message_id];
        userStates.set(userId, userState);
      }
    } catch (error: any) {
      console.error('[BOT] Error starting payment:', error.message);
      await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
  });

  // /cancel command - cancel current operation
  bot.command('cancel', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    if (userStates.has(userId)) {
      userStates.delete(userId);
      await ctx.reply('Amal bekor qilindi.');
    } else {
      await ctx.reply('Hech qanday faol amal yo\'q.');
    }
  });

  // Handle text messages for payment flow
  bot.on('text', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const userState = userStates.get(userId);
    if (!userState) return;

    const text = ctx.message.text;

    // Skip if it's a command
    if (text.startsWith('/')) return;

    try {
      if (userState.step === 'waiting_for_school21_nick') {
        let school21Nick = text.trim();
        
        // Remove @ if user included it
        if (school21Nick.startsWith('@')) {
          school21Nick = school21Nick.substring(1);
        }
        
        // Find student in database
        console.log('[BOT] Looking for student with nick:', school21Nick);
        const studentsResponse = await axios.get(`${BACKEND_URL}/api/students`);
        const students = studentsResponse.data;
        const student = students.find((s: any) => 
          s.username.toLowerCase() === school21Nick.toLowerCase()
        );

        if (!student) {
          await ctx.reply(
            `❌ Siz tizimda topilmadingiz.\n\n` +
            `Kiritilgan nik: @${school21Nick}\n\n` +
            `Iltimos, to'g'ri School21 nikingizni kiriting yoki admin bilan bog'laning.`
          );
          return;
        }

        // Delete previous messages
        if (userState.data.messageIds) {
          for (const msgId of userState.data.messageIds) {
            try {
              await ctx.deleteMessage(msgId);
            } catch (e) {
              console.log('[BOT] Could not delete message:', msgId);
            }
          }
        }
        
        // Delete user's message
        try {
          await ctx.deleteMessage(ctx.message.message_id);
        } catch (e) {
          console.log('[BOT] Could not delete user message');
        }

        // Save student info
        userState.data.school21Nick = school21Nick;
        userState.data.fullName = student.fullName || student.username;
        userState.data.room = student.room || '-';
        userState.data.studentId = student.id;
        userState.step = 'waiting_for_file';
        userStates.set(userId, userState);

        const msg = await ctx.reply(
          `✅ Topildi!\n\n` +
          `👤 Ism: ${userState.data.fullName}\n` +
          `🏠 Xona: ${userState.data.room}\n\n` +
          `📷 Endi to'lov chekini yuboring (rasm yoki PDF)`
        );
        
        userState.data.messageIds = [msg.message_id];
        userStates.set(userId, userState);
      }
    } catch (error: any) {
      console.error('[BOT] Error processing text:', error.message);
      await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
  });

  // Handle photo messages for payment
  bot.on('photo', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const userState = userStates.get(userId);
    if (!userState || userState.step !== 'waiting_for_file') {
      return; // Ignore photos not part of payment flow
    }

    try {
      // Get the largest photo
      const photos = ctx.message.photo;
      const photo = photos[photos.length - 1];
      const fileId = photo.file_id;

      await processPayment(ctx, bot, userId, userState, fileId, 'photo');
    } catch (error: any) {
      console.error('[BOT] Error processing payment photo:', error.message);
      console.error('[BOT] Error details:', error.response?.data || error);
      await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      userStates.delete(userId);
    }
  });

  // Handle document (PDF) messages for payment
  bot.on('document', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const userState = userStates.get(userId);
    if (!userState || userState.step !== 'waiting_for_file') {
      return; // Ignore documents not part of payment flow
    }

    try {
      const document = ctx.message.document;
      const fileId = document.file_id;

      await processPayment(ctx, bot, userId, userState, fileId, 'document');
    } catch (error: any) {
      console.error('[BOT] Error processing payment document:', error.message);
      console.error('[BOT] Error details:', error.response?.data || error);
      await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      userStates.delete(userId);
    }
  });
}

/**
 * Process payment submission
 */
async function processPayment(
  ctx: Context,
  bot: Telegraf<Context>,
  userId: number,
  userState: { step: string; data: PaymentData },
  fileId: string,
  fileType: 'photo' | 'document'
) {
  const { school21Nick, fullName, room, month, studentId } = userState.data;

  console.log('[BOT] Processing payment:', { school21Nick, fullName, room, month, fileType });

  // Submit payment to database
  const paymentResponse = await axios.post(`${BACKEND_URL}/api/payments`, {
    studentId: studentId || 0,
    amount: 0,
    month: month,
    imageUrl: fileId,
    status: 'pending',
    note: `School21: @${school21Nick}, Ism: ${fullName}, Xona: ${room}`
  });

  console.log('[BOT] Payment created:', paymentResponse.data);

  // Send confirmation to user
  await ctx.reply(
    `To'lov cheki qabul qilindi!\n\n` +
    `Ma'lumotlar:\n` +
    `School21 nik: @${school21Nick}\n` +
    `To'liq ism: ${fullName}\n` +
    `Xona: ${room}\n` +
    `Oy: ${month}\n\n` +
    `To'lovingiz ko'rib chiqilmoqda. Tez orada javob beramiz.`
  );

  // Clear user state
  userStates.delete(userId);

  // Send to payment group
  const TELEGRAM_PAYMENT_GROUP_ID = process.env.TELEGRAM_PAYMENT_GROUP_ID;
  if (TELEGRAM_PAYMENT_GROUP_ID) {
    // Format date as DD.MM.YYYY
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
    
    const message = 
      `YANGI TO'LOV CHEKI\n\n` +
      `School21: ${school21Nick}\n` +
      `Ism: ${fullName}\n` +
      `Xona: ${room}\n` +
      `Oy: ${month}\n` +
      `Sana: ${dateStr}\n\n` +
      `━━━━━━━━━━━━━━━━━━━`;

    if (fileType === 'photo') {
      await bot.telegram.sendPhoto(TELEGRAM_PAYMENT_GROUP_ID, fileId, {
        caption: message
      });
    } else {
      await bot.telegram.sendDocument(TELEGRAM_PAYMENT_GROUP_ID, fileId, {
        caption: message
      });
    }
    console.log('[BOT] Payment notification sent to payment group');
  }
}
