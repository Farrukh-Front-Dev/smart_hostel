import { DutyResponse } from '../types';
export declare class DutyService {
    static getTodayDuties(): Promise<DutyResponse>;
    static getTomorrowDuties(): Promise<DutyResponse>;
    static getDutiesForDate(date: Date): Promise<DutyResponse>;
}
