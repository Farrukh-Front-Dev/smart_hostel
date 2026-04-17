"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
// Check backend status
router.get('/backend', (req, res) => {
    const status = {
        name: 'Backend',
        status: 'online',
        responseTime: 0,
        lastChecked: new Date().toISOString(),
    };
    res.json(status);
});
// Check bot status
router.get('/bot', async (req, res) => {
    try {
        const botUrl = process.env.BOT_URL || 'http://localhost:3004';
        const startTime = Date.now();
        await axios_1.default.get(`${botUrl}/health`, { timeout: 5000 });
        const responseTime = Date.now() - startTime;
        const status = {
            name: 'Bot',
            status: 'online',
            responseTime,
            lastChecked: new Date().toISOString(),
        };
        res.json(status);
    }
    catch (error) {
        const status = {
            name: 'Bot',
            status: 'offline',
            responseTime: 0,
            lastChecked: new Date().toISOString(),
        };
        res.status(503).json(status);
    }
});
// Check all services
router.get('/all', async (req, res) => {
    const backendStatus = {
        name: 'Backend',
        status: 'online',
        responseTime: 0,
        lastChecked: new Date().toISOString(),
    };
    let botStatus = {
        name: 'Bot',
        status: 'offline',
        responseTime: 0,
        lastChecked: new Date().toISOString(),
    };
    try {
        const botUrl = process.env.BOT_URL || 'http://localhost:3004';
        const startTime = Date.now();
        await axios_1.default.get(`${botUrl}/health`, { timeout: 5000 });
        botStatus = {
            name: 'Bot',
            status: 'online',
            responseTime: Date.now() - startTime,
            lastChecked: new Date().toISOString(),
        };
    }
    catch (error) {
        // Bot is offline
    }
    res.json({
        services: [backendStatus, botStatus],
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
//# sourceMappingURL=status.js.map