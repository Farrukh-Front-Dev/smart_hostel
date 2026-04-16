"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDutiesMessage = exports.formatPaymentMessage = exports.MESSAGES = void 0;
exports.MESSAGES = {
    WELCOME: `👋 SmartHostel Botiga xush kelibsiz!\n\nQuyidagi tugmalardan birini tanlang:`,
    HELP: `📋 SmartHostel Buyruqlari:\n\n` +
        `/today - Bugungi navbatchiliklar\n` +
        `/tomorrow - Ertangi navbatchiliklar\n` +
        `/oplata - Hostel to'lovini yuborish\n` +
        `/help - Yordam`,
    PAYMENT_START: `School21 nikingizni kiriting:`,
    PAYMENT_CANCELLED: `❌ Amal bekor qilindi.`,
    NO_ACTIVE_OPERATION: `Hech qanday faol amal yo'q.`,
    STUDENT_NOT_FOUND: (nick) => `❌ Siz tizimda topilmadingiz.\n\n` +
        `Kiritilgan nik: @${nick}\n\n` +
        `Iltimos, to'g'ri School21 nikingizni kiriting yoki admin bilan bog'laning.`,
    STUDENT_FOUND: (fullName, room) => `✅ Topildi!\n👤 ${fullName} | 🏠 ${room}\n\n📷 Chekni yuboring`,
    PAYMENT_SENT: (nick, fullName, room, month) => `✅ To'lov cheki guruhga yuborildi!\n\n` +
        `📝 Ma'lumotlar:\n` +
        `👤 School21: @${nick}\n` +
        `🏷 Ism: ${fullName}\n` +
        `🏠 Xona: ${room}\n` +
        `📅 Oy: ${month}`,
    ERROR: `❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.`,
    DUTIES_NOT_FOUND: `❌ Navbatchiliklar topilmadi.`,
    SESSION_EXPIRED: `Sessiya tugadi. Iltimos, qaytadan boshlang.`,
    SENDING: `Yuborilmoqda...`,
    CANCELLED: `Bekor qilindi`,
    PAYMENT_CANCELLED_FULL: `❌ To'lov yuborish bekor qilindi.`,
};
const formatPaymentMessage = (nick, fullName, room, month, date) => {
    return `YANGI TO'LOV CHEKI\n\n` +
        `Nickname: ${nick}\n` +
        `Ism: ${fullName}\n` +
        `Xona: ${room}\n` +
        `Sana: ${date}\n\n` +
        `━━━━━━━━━━━━━━━━━━━`;
};
exports.formatPaymentMessage = formatPaymentMessage;
const formatDutiesMessage = (title, duties) => {
    let message = `📅 ${title}\n\n`;
    for (const floor in duties.byFloor) {
        const students = duties.byFloor[floor];
        if (students.length > 0) {
            message += `🏢 ${floor}-qavat:\n`;
            students.forEach((student) => {
                // Always use username (School21 nick), with mention if telegramId exists
                if (student.telegramId) {
                    message += `  • [${student.username}](tg://user?id=${student.telegramId})\n`;
                }
                else {
                    message += `  • ${student.username}\n`;
                }
            });
            message += '\n';
        }
    }
    return message;
};
exports.formatDutiesMessage = formatDutiesMessage;
//# sourceMappingURL=messages.js.map