"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../config/constants");
class StudentService {
    static async findByUsername(username) {
        try {
            const response = await axios_1.default.get(`${constants_1.BACKEND_URL}/api/students`);
            const students = response.data;
            const student = students.find((s) => s.username.toLowerCase() === username.toLowerCase());
            return student || null;
        }
        catch (error) {
            console.error('[StudentService] Error finding student:', error);
            throw error;
        }
    }
}
exports.StudentService = StudentService;
//# sourceMappingURL=studentService.js.map