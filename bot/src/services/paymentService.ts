import axios from 'axios';
import { Telegraf } from 'telegraf';
import { BACKEND_URL, TELEGRAM_PAYMENT_GROUP_ID } from '../config/constants';
import { formatPaymentMessage } from '../utils/messages';
import { formatDate } from '../utils/date';

interface PaymentSubmission {
  studentId: number;
  amount: number;
  month: string;
  imageUrl: string;
  status: string;
  note: string;
}

export class PaymentService {
  static async submitPayment(data: PaymentSubmission): Promise<void> {
    try {
      await axios.post(`${BACKEND_URL}/api/payments`, data);
      console.log('[PaymentService] Payment submitted successfully');
    } catch (error) {
      console.error('[PaymentService] Error submitting payment:', error);
      throw error;
    }
  }

  static async sendToGroup(
    bot: Telegraf,
    nick: string,
    fullName: string,
    room: string,
    month: string,
    fileId: string,
    fileType: 'photo' | 'document'
  ): Promise<void> {
    if (!TELEGRAM_PAYMENT_GROUP_ID) {
      console.warn('[PaymentService] Payment group ID not configured');
      return;
    }

    try {
      const message = formatPaymentMessage(nick, fullName, room, month, formatDate());

      if (fileType === 'photo') {
        await bot.telegram.sendPhoto(TELEGRAM_PAYMENT_GROUP_ID, fileId, {
          caption: message
        });
      } else {
        await bot.telegram.sendDocument(TELEGRAM_PAYMENT_GROUP_ID, fileId, {
          caption: message
        });
      }

      console.log('[PaymentService] Payment sent to group');
    } catch (error) {
      console.error('[PaymentService] Error sending to group:', error);
      throw error;
    }
  }
}
