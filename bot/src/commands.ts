import { Telegraf, Context } from 'telegraf';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

/**
 * Setup bot commands
 */
export function setupCommands(bot: Telegraf<Context>) {
  // /start command
  bot.start((ctx) => {
    ctx.reply(
      `👋 Welcome to SmartHostel Bot!\n\n` +
        `Available commands:\n` +
        `/today - View today's duty assignments\n` +
        `/tomorrow - View tomorrow's duty assignments\n` +
        `/report - Submit a duty completion report\n` +
        `/help - Show this message`
    );
  });

  // /help command
  bot.help((ctx) => {
    ctx.reply(
      `📋 SmartHostel Commands:\n\n` +
        `/today - View today's duty assignments\n` +
        `/tomorrow - View tomorrow's duty assignments\n` +
        `/report - Submit a duty completion report\n` +
        `/help - Show this message\n\n` +
        `💡 Tip: Send a photo with caption to submit a duty report`
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

  // /report command
  bot.command('report', async (ctx) => {
    await ctx.reply(
      `📸 To submit a duty report:\n\n` +
        `1. Take a photo of your completed duty\n` +
        `2. Send the photo to this bot\n` +
        `3. Add a caption with any notes (optional)\n\n` +
        `Example caption: "Floor 2 cleaning completed"`
    );
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

        await bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message);
        console.log('[BOT] Test duties message sent');
      } catch (error) {
        console.error('[BOT] Test error:', error);
      }
    }, 1000); // Send every 1 second
  });
}
