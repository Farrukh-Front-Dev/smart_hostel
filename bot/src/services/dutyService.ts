import axios from 'axios';
import { BACKEND_URL } from '../config/constants';
import { DutyResponse } from '../types';

export class DutyService {
  static async getTodayDuties(): Promise<DutyResponse> {
    try {
      const response = await axios.get<DutyResponse>(`${BACKEND_URL}/api/duties/today`);
      return response.data;
    } catch (error) {
      console.error('[DutyService] Error fetching today duties:', error);
      throw error;
    }
  }

  static async getTomorrowDuties(): Promise<DutyResponse> {
    try {
      const response = await axios.get<DutyResponse>(`${BACKEND_URL}/api/duties/tomorrow`);
      return response.data;
    } catch (error) {
      console.error('[DutyService] Error fetching tomorrow duties:', error);
      throw error;
    }
  }

  static async getDutiesForDate(date: Date): Promise<DutyResponse> {
    try {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const response = await axios.get<DutyResponse>(`${BACKEND_URL}/api/duties/date/${dateStr}`);
      return response.data;
    } catch (error) {
      console.error('[DutyService] Error fetching duties for date:', error);
      throw error;
    }
  }
}
