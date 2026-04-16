import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SettingsService {
  /**
   * Get setting by key
   */
  static async getSetting(key: string): Promise<string | null> {
    const setting = await prisma.settings.findUnique({
      where: { key },
    });
    return setting?.value || null;
  }

  /**
   * Set setting value
   */
  static async setSetting(key: string, value: string) {
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
  static async getDutyMessageFormat(): Promise<'simple' | 'timed'> {
    const format = await this.getSetting('duty_message_format');
    return (format === 'timed' ? 'timed' : 'simple') as 'simple' | 'timed';
  }

  /**
   * Set duty message format
   */
  static async setDutyMessageFormat(format: 'simple' | 'timed') {
    return this.setSetting('duty_message_format', format);
  }
}
