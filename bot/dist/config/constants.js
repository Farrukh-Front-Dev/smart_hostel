"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALLBACK_ACTIONS = exports.PAYMENT_STEPS = exports.BOT_PORT = exports.BOT_TOKEN = exports.TELEGRAM_PAYMENT_GROUP_ID = exports.TELEGRAM_DUTY_GROUP_ID = exports.BACKEND_URL = void 0;
exports.BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
exports.TELEGRAM_DUTY_GROUP_ID = process.env.TELEGRAM_DUTY_GROUP_ID;
exports.TELEGRAM_PAYMENT_GROUP_ID = process.env.TELEGRAM_PAYMENT_GROUP_ID;
exports.BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
exports.BOT_PORT = parseInt(process.env.BOT_PORT || '3001');
exports.PAYMENT_STEPS = {
    WAITING_FOR_NICK: 'waiting_for_school21_nick',
    WAITING_FOR_FILE: 'waiting_for_file',
};
exports.CALLBACK_ACTIONS = {
    START_OPLATA: 'start_oplata',
    HELP: 'help',
    SEND_PAYMENT: 'send_payment',
    CANCEL_PAYMENT: 'cancel_payment',
};
//# sourceMappingURL=constants.js.map