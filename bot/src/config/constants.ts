export const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
export const TELEGRAM_DUTY_GROUP_ID = process.env.TELEGRAM_DUTY_GROUP_ID;
export const TELEGRAM_PAYMENT_GROUP_ID = process.env.TELEGRAM_PAYMENT_GROUP_ID;
export const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const BOT_PORT = parseInt(process.env.BOT_PORT || '3001');

export const PAYMENT_STEPS = {
  WAITING_FOR_NICK: 'waiting_for_school21_nick',
  WAITING_FOR_FILE: 'waiting_for_file',
} as const;

export const CALLBACK_ACTIONS = {
  START_OPLATA: 'start_oplata',
  HELP: 'help',
  SEND_PAYMENT: 'send_payment',
  CANCEL_PAYMENT: 'cancel_payment',
} as const;
