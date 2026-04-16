"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../config/constants");
const messages_1 = require("../utils/messages");
const date_1 = require("../utils/date");
class PaymentService {
    static async submitPayment(data) {
        try {
            await axios_1.default.post(`${constants_1.BACKEND_URL}/api/payments`, data);
            console.log('[PaymentService] Payment submitted successfully');
        }
        catch (error) {
            console.error('[PaymentService] Error submitting payment:', error);
            throw error;
        }
    }
    static async sendToGroup(bot, nick, fullName, room, month, fileId, fileType) {
        if (!constants_1.TELEGRAM_PAYMENT_GROUP_ID) {
            console.warn('[PaymentService] Payment group ID not configured');
            return;
        }
        try {
            const message = (0, messages_1.formatPaymentMessage)(nick, fullName, room, month, (0, date_1.formatDate)());
            if (fileType === 'photo') {
                await bot.telegram.sendPhoto(constants_1.TELEGRAM_PAYMENT_GROUP_ID, fileId, {
                    caption: message
                });
            }
            else {
                await bot.telegram.sendDocument(constants_1.TELEGRAM_PAYMENT_GROUP_ID, fileId, {
                    caption: message
                });
            }
            console.log('[PaymentService] Payment sent to group');
        }
        catch (error) {
            console.error('[PaymentService] Error sending to group:', error);
            throw error;
        }
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=paymentService.js.map