"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SettingsService {
    /**
     * Get setting by key
     */
    static async getSetting(key) {
        const setting = await prisma.settings.findUnique({
            where: { key },
        });
        return setting?.value || null;
    }
    /**
     * Set setting value
     */
    static async setSetting(key, value) {
        return prisma.settings.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }
    /**
     * Get all settings
     */
    static async getAllSettings() {
        return prisma.settings.findMany();
    }
    /**
     * Get duty message format (simple or timed)
     */
    static async getDutyMessageFormat() {
        const format = await this.getSetting('duty_message_format');
        return (format === 'timed' ? 'timed' : 'simple');
    }
    /**
     * Set duty message format
     */
    static async setDutyMessageFormat(format) {
        return this.setSetting('duty_message_format', format);
    }
}
exports.SettingsService = SettingsService;
//# sourceMappingURL=settingsService.js.map