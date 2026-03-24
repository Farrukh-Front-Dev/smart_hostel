import { Telegraf, Context } from 'telegraf';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

interface UserSession {
  studentId: number;
  dutyDate: Date;
  sessionId: number;
  step: 'nickname' | 'photos' | 'confirmation';
  nickname?: string;
  photoCount: number;
  photoFileIds: string[];
  floormates: Array<{ id: number; name: string; username: string }>;
}

// Store active sessions in memory (in production, use Redis)
const activeSessions = new Map<number, UserSession>();

/**
 * Start duty workflow for a student
 */
export async function startDutyWorkflow(ctx: Context, studentId: number, dutyDate: Date) {
  try {
    const userId = ctx.from?.id;
    if (!userId) return;

    // Create session in backend
    const response = await axios.post(`${BACKEND_URL}/api/bot/session`, {
      studentId,
      dutyDate: dutyDate.toISOString(),
    });

    const session: UserSession = {
      studentId,
      dutyDate,
      sessionId: response.data.id,
      step: 'nickname',
      photoCount: 0,
      photoFileIds: [],
      floormates: response.data.floormates || [],
    };

    activeSessions.set(userId, session);

    // Ask for nickname
    await ctx.reply(
      `👋 Hello! I'm starting your duty report for ${dutyDate.toLocaleDateString()}.\n\n` +
        `First, what's your nickname? (Please reply with just your nickname)`
    );
  } catch (error) {
    console.error('[BOT] Error starting duty workflow:', error);
    await ctx.reply('❌ Error starting duty workflow. Please try again.');
  }
}

/**
 * Handle nickname input
 */
export async function handleNicknameInput(ctx: Context, text: string) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const session = activeSessions.get(userId);
  if (!session || session.step !== 'nickname') return;

  session.nickname = text.trim();
  session.step = 'photos';

  // Update session in backend
  await axios.patch(`${BACKEND_URL}/api/bot/session/${session.sessionId}`, {
    step: 'photos',
    nickname: session.nickname,
  });

  await ctx.reply(
    `✅ Got it! Your nickname is: ${session.nickname}\n\n` +
      `Now, please send me at least 3 photos of your duty completion.\n` +
      `Send them one by one, and I'll let you know when I have enough.`
  );
}

/**
 * Handle photo uploads
 */
export async function handlePhotoUpload(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const session = activeSessions.get(userId);
  if (!session || session.step !== 'photos') return;

  try {
    // Type guard to check if message has photo
    if (!ctx.message || !('photo' in ctx.message) || !ctx.message.photo) return;
    
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    if (!photo) return;

    session.photoFileIds.push(photo.file_id);
    session.photoCount++;

    const remaining = Math.max(0, 3 - session.photoCount);

    if (session.photoCount < 3) {
      await ctx.reply(
        `📸 Photo ${session.photoCount}/3 received!\n\n` +
          `Please send ${remaining} more photo${remaining !== 1 ? 's' : ''}.`
      );
    } else {
      session.step = 'confirmation';

      // Update session in backend
      await axios.patch(`${BACKEND_URL}/api/bot/session/${session.sessionId}`, {
        step: 'confirmation',
        photoCount: session.photoCount,
      });

      // Format confirmation message
      const dateStr = session.dutyDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      let confirmMsg = `✅ All photos received!\n\n`;
      confirmMsg += `📋 Duty Report Summary:\n`;
      confirmMsg += `• Date: ${dateStr}\n`;
      confirmMsg += `• Nickname: ${session.nickname}\n`;
      confirmMsg += `• Photos: ${session.photoCount}\n\n`;
      confirmMsg += `Ready to submit? Reply with "yes" to confirm or "no" to cancel.`;

      await ctx.reply(confirmMsg);
    }
  } catch (error) {
    console.error('[BOT] Error handling photo:', error);
    await ctx.reply('❌ Error processing photo. Please try again.');
  }
}

/**
 * Handle confirmation
 */
export async function handleConfirmation(ctx: Context, text: string) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const session = activeSessions.get(userId);
  if (!session || session.step !== 'confirmation') return;

  const response = text.toLowerCase().trim();

  if (response === 'yes') {
    try {
      // Submit to backend
      await axios.post(`${BACKEND_URL}/api/bot/submit-report`, {
        sessionId: session.sessionId,
        studentId: session.studentId,
        dutyDate: session.dutyDate.toISOString(),
        nickname: session.nickname,
        photoCount: session.photoCount,
        photoFileIds: session.photoFileIds,
      });

      await ctx.reply(
        `🎉 Duty report submitted successfully!\n\n` +
          `Thank you for completing your duty assignment.`
      );

      activeSessions.delete(userId);
    } catch (error) {
      console.error('[BOT] Error submitting report:', error);
      await ctx.reply('❌ Error submitting report. Please try again.');
    }
  } else if (response === 'no') {
    await ctx.reply(
      `❌ Report cancelled.\n\n` +
        `You can start over anytime by sending /start`
    );
    activeSessions.delete(userId);
  } else {
    await ctx.reply(`Please reply with "yes" to confirm or "no" to cancel.`);
  }
}

/**
 * Get active session for user
 */
export function getActiveSession(userId: number): UserSession | undefined {
  return activeSessions.get(userId);
}

/**
 * Clear session
 */
export function clearSession(userId: number) {
  activeSessions.delete(userId);
}
