export declare class SettingsService {
    /**
     * Get setting by key
     */
    static getSetting(key: string): Promise<string | null>;
    /**
     * Set setting value
     */
    static setSetting(key: string, value: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        key: string;
        value: string;
    }>;
    /**
     * Get all settings
     */
    static getAllSettings(): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        key: string;
        value: string;
    }[]>;
    /**
     * Get duty message format (simple or timed)
     */
    static getDutyMessageFormat(): Promise<'simple' | 'timed'>;
    /**
     * Set duty message format
     */
    static setDutyMessageFormat(format: 'simple' | 'timed'): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        key: string;
        value: string;
    }>;
}
//# sourceMappingURL=settingsService.d.ts.map