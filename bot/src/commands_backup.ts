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
    const keyboard = {
      inline_keyboard: [
        [{ text: '💳 Oplata yuborish', callback_data: 'start_oplata' }],
        [
          { text: '📅 Bugungi navbatchilik', callback_data: 'today' },
          { text: '📅 Ertangi navbatchilik', callback_data: 'tomorrow' }
        ],
        [{ text: '❓ Yordam', callback_data: 'help' }]
      ]
    };

    ctx.reply(
      `👋 SmartHostel Botiga xush kelibsiz!\n\n` +
        `Quyidagi tugmalardan birini tanlang:`,
      { reply_markup: keyboard }
    );
  });

  // /help command
  bot.help((ctx) => {
    const keyboard = {
      inline_keyboard: [
        [{ text: '💳 Oplata yuborish', callback_data: 'start_oplata' }],
        [
          { text: '📅 Bugungi navbatchilik', callback_data: 'today' },
          { text: '📅 Ertangi navbatchilik', callback_data: 'tomorrow' }
        ]
      ]
    };

    ctx.reply(
      `📋 SmartHostel Buyruqlari:\n\n` +
        `/today - Bugungi navbatchiliklar\n` +
        `/tomorrow - Ertangi navbatchiliklar\n` +
        `/oplata - Hostel to'lovini yuborish\n` +
        `/help - Yordam\n\n` +
        `Yoki quyidagi tugmalardan foydalaning:`,
      { reply_markup: keyboard }
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

  // /groupid command
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

  // /invite command
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

  // /oplata command - start payment submission flow
  bot.command('oplata', async (ctx) => {
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

  // /cancel command
  bot.command('cancel', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    if (userStates.has(userId)) {
      userStates.delete(userId);
      await ctx.reply('❌ Amal bekor qilindi.');
    } else {
      await ctx.reply('Hech qanday faol amal yo\'q.');
    }
  });

  // Handle text messages for payment flow
  bot.on('text', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = ctx.message.text;

    const userState = userStates.get(userId);
    if (!userState) return;

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
      return;
    }

    try {
      const photos = ctx.message.photo;
      const photo = photos[photos.length - 1];
      const fileId = photo.file_id;

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
      
      // Delete user's photo message
      try {
        await ctx.deleteMessage(ctx.message.message_id);
      } catch (e) {
        console.log('[BOT] Could not delete user photo');
      }

      await showPaymentPreview(ctx, bot, userId, userState, fileId, 'photo');
    } catch (error: any) {
      console.error('[BOT] Error processing payment photo:', error.message);
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
      return;
    }

    try {
      const document = ctx.message.document;
      const fileId = document.file_id;

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
      
      // Delete user's document message
      try {
        await ctx.deleteMessage(ctx.message.message_id);
      } catch (e) {
        console.log('[BOT] Could not delete user document');
      }

      await showPaymentPreview(ctx, bot, userId, userState, fileId, 'document');
    } catch (error: any) {
      console.error('[BOT] Error processing payment document:', error.message);
      await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      userStates.delete(userId);
    }
  });

  // Handle callback queries (button clicks)
  bot.on('callback_query', async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) return;

    const data = (ctx.callbackQuery as any).data;
    
    if (data === 'start_oplata') {
      await ctx.answerCbQuery();
      // Trigger /oplata command
      try {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

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
        
        const userState = userStates.get(userId);
        if (userState) {
          userState.data.messageIds = [msg.message_id];
          userStates.set(userId, userState);
        }
      } catch (error: any) {
        console.error('[BOT] Error starting payment:', error.message);
        await ctx.reply('❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      }
    } else if (data === 'today') {
      await ctx.answerCbQuery();
      try {
        const response = await axios.get(`${BACKEND_URL}/api/duties/today`);
        const duties = response.data;

        let message = `📅 Bugungi navbatchiliklar\n\n`;

        for (const floor in duties.byFloor) {
          const students = duties.byFloor[floor];
          if (students.length > 0) {
            message += `🏢 ${floor}-qavat:\n`;
            students.forEach((student: any) => {
              message += `  • ${student.username || student.name}\n`;
            });
            message += '\n';
          }
        }

        await ctx.reply(message);
      } catch (error: any) {
        console.error('[BOT] Error fetching today duties:', error.message);
        await ctx.reply('❌ Navbatchiliklar topilmadi.');
      }
    } else if (data === 'tomorrow') {
      await ctx.answerCbQuery();
      try {
        const response = await axios.get(`${BACKEND_URL}/api/duties/tomorrow`);
        const duties = response.data;

        let message = `📅 Ertangi navbatchiliklar\n\n`;

        for (const floor in duties.byFloor) {
          const students = duties.byFloor[floor];
          if (students.length > 0) {
            message += `🏢 ${floor}-qavat:\n`;
            students.forEach((student: any) => {
              message += `  • ${student.username || student.name}\n`;
            });
            message += '\n';
          }
        }

        await ctx.reply(message);
      } catch (error: any) {
        console.error('[BOT] Error fetching tomorrow duties:', error.message);
        await ctx.reply('❌ Navbatchiliklar topilmadi.');
      }
    } else if (data === 'help') {
      await ctx.answerCbQuery();
      const keyboard = {
        inline_keyboard: [
          [{ text: '💳 Oplata yuborish', callback_data: 'start_oplata' }],
          [
            { text: '📅 Bugungi navbatchilik', callback_data: 'today' },
            { text: '📅 Ertangi navbatchilik', callback_data: 'tomorrow' }
          ]
        ]
      };

      await ctx.reply(
        `📋 SmartHostel Buyruqlari:\n\n` +
          `/today - Bugungi navbatchiliklar\n` +
          `/tomorrow - Ertangi navbatchiliklar\n` +
          `/oplata - Hostel to'lovini yuborish\n` +
          `/help - Yordam`,
        { reply_markup: keyboard }
      );
    } else if (data === 'send_payment') {
      const userState = userStates.get(userId);
      if (!userState) {
        await ctx.answerCbQuery('Sessiya tugadi. Iltimos, qaytadan boshlang.');
        return;
      }

      await ctx.answerCbQuery('Yuborilmoqda...');
      await sendPaymentToGroup(ctx, bot, userId, userState);
    } else if (data === 'cancel_payment') {
      userStates.delete(userId);
      await ctx.answerCbQuery('Bekor qilindi');
      try {
        await ctx.deleteMessage();
      } catch (e) {
        console.log('[BOT] Could not delete preview message');
      }
      await ctx.reply('❌ To\'lov yuborish bekor qilindi.');
    }
  });
}

/**
 * Show payment preview with confirmation buttons
 */
async function showPaymentPreview(
  ctx: Context,
  bot: Telegraf<Context>,
  userId: number,
  userState: { step: string; data: PaymentData },
  fileId: string,
  fileType: 'photo' | 'document'
) {
  const { school21Nick, fullName, room, month } = userState.data;

  // Save file info
  userState.data.fileId = fileId;
  userState.data.fileType = fileType;
  userStates.set(userId, userState);

  // Format date as DD.MM.YYYY
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
  
  const message = 
    `YANGI TO'LOV CHEKI\n\n` +
    `School21: @${school21Nick}\n` +
    `Ism: ${fullName}\n` +
    `Xona: ${room}\n` +
    `Oy: ${month}\n` +
    `Sana: ${dateStr}\n\n` +
    `━━━━━━━━━━━━━━━━━━━`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '✅ Guruhga yuborish', callback_data: 'send_payment' },
        { text: '❌ Bekor qilish', callback_data: 'cancel_payment' }
      ]
    ]
  };

  if (fileType === 'photo') {
    await ctx.replyWithPhoto(fileId, {
      caption: message,
      reply_markup: keyboard
    });
  } else {
    await ctx.replyWithDocument(fileId, {
      caption: message,
      reply_markup: keyboard
    });
  }
}

/**
 * Send payment to group after confirmation
 */
async function sendPaymentToGroup(
  ctx: Context,
  bot: Telegraf<Context>,
  userId: number,
  userState: { step: string; data: PaymentData }
) {
  const { school21Nick, fullName, room, month, fileId, fileType, studentId } = userState.data;

  console.log('[BOT] Sending payment to group:', { school21Nick, fullName, room, month, fileType });

  // Submit payment to database
  await axios.post(`${BACKEND_URL}/api/payments`, {
    studentId: studentId || 0,
    amount: 0,
    month: month,
    imageUrl: fileId,
    status: 'pending',
    note: `School21: @${school21Nick}, Ism: ${fullName}, Xona: ${room}`
  });

  // Send to payment group
  const TELEGRAM_PAYMENT_GROUP_ID = process.env.TELEGRAM_PAYMENT_GROUP_ID;
  if (TELEGRAM_PAYMENT_GROUP_ID) {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
    
    const message = 
      `YANGI TO'LOV CHEKI\n\n` +
      `School21: @${school21Nick}\n` +
      `Ism: ${fullName}\n` +
      `Xona: ${room}\n` +
      `Oy: ${month}\n` +
      `Sana: ${dateStr}\n\n` +
      `━━━━━━━━━━━━━━━━━━━`;

    if (fileType === 'photo') {
      await bot.telegram.sendPhoto(TELEGRAM_PAYMENT_GROUP_ID, fileId!, {
        caption: message
      });
    } else {
      await bot.telegram.sendDocument(TELEGRAM_PAYMENT_GROUP_ID, fileId!, {
        caption: message
      });
    }
    console.log('[BOT] Payment sent to group');
  }

  // Delete preview message
  try {
    await ctx.deleteMessage();
  } catch (e) {
    console.log('[BOT] Could not delete preview');
  }

  // Send confirmation
  await ctx.reply(
    `✅ To'lov cheki guruhga yuborildi!\n\n` +
    `📝 Ma'lumotlar:\n` +
    `👤 School21: @${school21Nick}\n` +
    `🏷 Ism: ${fullName}\n` +
    `🏠 Xona: ${room}\n` +
    `📅 Oy: ${month}`
  );

  // Clear user state
  userStates.delete(userId);
}
