"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const students_1 = __importDefault(require("./routes/students"));
const duties_1 = __importDefault(require("./routes/duties"));
const reports_1 = __importDefault(require("./routes/reports"));
const bot_1 = __importDefault(require("./routes/bot"));
const scheduler_1 = require("./cron/scheduler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/students', students_1.default);
app.use('/api/duties', duties_1.default);
app.use('/api/reports', reports_1.default);
app.use('/api/bot', bot_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString(),
    });
});
// Start server
const startServer = async () => {
    try {
        // Test database connection
        await prisma.$queryRaw `SELECT 1`;
        console.log('✓ Database connected');
        // Initialize scheduler
        (0, scheduler_1.initializeScheduler)();
        console.log('✓ Scheduler initialized');
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
//# sourceMappingURL=index.js.map