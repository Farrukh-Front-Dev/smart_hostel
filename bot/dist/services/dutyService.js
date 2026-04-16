"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DutyService = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../config/constants");
class DutyService {
    static async getTodayDuties() {
        try {
            const response = await axios_1.default.get(`${constants_1.BACKEND_URL}/api/duties/today`);
            return response.data;
        }
        catch (error) {
            console.error('[DutyService] Error fetching today duties:', error);
            throw error;
        }
    }
    static async getTomorrowDuties() {
        try {
            const response = await axios_1.default.get(`${constants_1.BACKEND_URL}/api/duties/tomorrow`);
            return response.data;
        }
        catch (error) {
            console.error('[DutyService] Error fetching tomorrow duties:', error);
            throw error;
        }
    }
    static async getDutiesForDate(date) {
        try {
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            const response = await axios_1.default.get(`${constants_1.BACKEND_URL}/api/duties/date/${dateStr}`);
            return response.data;
        }
        catch (error) {
            console.error('[DutyService] Error fetching duties for date:', error);
            throw error;
        }
    }
}
exports.DutyService = DutyService;
//# sourceMappingURL=dutyService.js.map