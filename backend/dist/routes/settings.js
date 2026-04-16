"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsService_1 = require("../services/settingsService");
const router = express_1.default.Router();
// Get all settings
router.get('/', async (req, res, next) => {
    try {
        const settings = await settingsService_1.SettingsService.getAllSettings();
        res.json(settings);
    }
    catch (error) {
        next(error);
    }
});
// Get specific setting
router.get('/:key', async (req, res, next) => {
    try {
        const value = await settingsService_1.SettingsService.getSetting(req.params.key);
        if (value === null) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        res.json({ key: req.params.key, value });
    }
    catch (error) {
        next(error);
    }
});
// Set setting
router.post('/:key', async (req, res, next) => {
    try {
        const { value } = req.body;
        const setting = await settingsService_1.SettingsService.setSetting(req.params.key, value);
        res.json(setting);
    }
    catch (error) {
        next(error);
    }
});
// Get duty message format
router.get('/duty/message-format', async (req, res, next) => {
    try {
        const format = await settingsService_1.SettingsService.getDutyMessageFormat();
        res.json({ format });
    }
    catch (error) {
        next(error);
    }
});
// Set duty message format
router.post('/duty/message-format', async (req, res, next) => {
    try {
        const { format } = req.body;
        if (format !== 'simple' && format !== 'timed') {
            return res.status(400).json({ error: 'Invalid format. Must be "simple" or "timed"' });
        }
        await settingsService_1.SettingsService.setDutyMessageFormat(format);
        res.json({ success: true, format });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=settings.js.map