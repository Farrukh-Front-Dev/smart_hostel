"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startKeepAlive = startKeepAlive;
const axios_1 = __importDefault(require("axios"));
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3003';
const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes
function startKeepAlive() {
    setInterval(async () => {
        try {
            await axios_1.default.get(`${BACKEND_URL}/health`);
            console.log('[KEEP-ALIVE] Backend pinged successfully');
        }
        catch (error) {
            console.error('[KEEP-ALIVE] Failed to ping backend:', error);
        }
    }, KEEP_ALIVE_INTERVAL);
}
//# sourceMappingURL=keepAlive.js.map