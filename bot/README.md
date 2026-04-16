# SmartHostel Telegram Bot

Professional Telegram bot for hostel management with clean architecture.

## 📁 Project Structure

```
bot/
├── src/
│   ├── config/           # Configuration and constants
│   │   └── constants.ts  # Environment variables and constants
│   ├── handlers/         # Request handlers (controllers)
│   │   ├── commandHandlers.ts    # Command handlers (/start, /help, etc.)
│   │   ├── callbackHandlers.ts  # Inline button handlers
│   │   └── messageHandlers.ts   # Text/photo/document handlers
│   ├── services/         # Business logic layer
│   │   ├── studentService.ts    # Student operations
│   │   ├── dutyService.ts       # Duty operations
│   │   ├── paymentService.ts    # Payment operations
│   │   ├── stateManager.ts      # User state management
│   │   └── messageTracker.ts    # Smart message cleanup
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # Shared types and interfaces
│   ├── utils/            # Utility functions
│   │   ├── keyboard.ts   # Keyboard layouts
│   │   ├── messages.ts   # Message templates
│   │   └── date.ts       # Date formatting utilities
│   ├── commands.ts       # Main command setup (entry point)
│   ├── api.ts            # API endpoints
│   ├── middleware.ts     # Bot middleware
│   └── index.ts          # Application entry point
├── .env                  # Environment variables
└── package.json          # Dependencies

```

## 🏗️ Architecture

### Clean Architecture Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Inversion**: High-level modules don't depend on low-level modules
3. **Single Responsibility**: Each class/function does one thing well
4. **DRY (Don't Repeat Yourself)**: Reusable utilities and services

### Layers

- **Handlers**: Handle incoming requests (commands, callbacks, messages)
- **Services**: Business logic and external API calls
- **Utils**: Pure functions for formatting, validation, etc.
- **Types**: Type definitions for type safety
- **Config**: Configuration and constants

## 🚀 Features

- ✅ **Smart Chat Cleanup**: Automatic message deletion for clean, focused conversations ([details](./CLEANUP_SYSTEM.md))
- ✅ **Hybrid Button System**: Keyboard + Inline buttons for optimal UX
- ✅ **Payment Submission**: Multi-step payment flow with preview
- ✅ **Duty Schedule**: View today's and tomorrow's duties
- ✅ **Clean Architecture**: Separation of concerns, maintainable code
- ✅ **State Management**: Robust user state handling
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Error Handling**: Comprehensive error handling and logging

## 🎮 User Interface

### Keyboard Buttons (Persistent, always visible)
```
┌──────────────────────────────┐
│    💳 Oplata yuborish        │
├──────────────┬───────────────┤
│ 📅 Bugungi   │ 📅 Ertangi    │
│    navbat    │    navbat     │
├──────────────┼───────────────┤
│ ℹ️ Ma'lumot  │ ⚙️ Yordam     │
└──────────────┴───────────────┘
```

### Inline Buttons (Context-specific)
- **Payment Preview**: ✅ Guruhga yuborish | ❌ Bekor qilish
- **Help Menu**: Quick access to features

## 📝 Commands

- `/start` - Welcome message with menu
- `/help` - Show help and commands
- `/oplata` - Submit hostel payment
- `/today` - View today's duties
- `/tomorrow` - View tomorrow's duties
- `/cancel` - Cancel current operation
- `/groupid` - Get chat/group ID
- `/invite` - Get bot invite link

## 🔧 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Start
npm start

# Development mode
npm run dev
```

## 🌟 Code Quality

- TypeScript for type safety
- ESLint for code quality
- Modular architecture
- Comprehensive error handling
- Logging for debugging
- Clean code principles

## 📦 Dependencies

- `telegraf` - Telegram Bot API framework
- `axios` - HTTP client
- `dotenv` - Environment variables
- `express` - API server

## 🔐 Environment Variables

```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_DUTY_GROUP_ID=duty_group_id
TELEGRAM_PAYMENT_GROUP_ID=payment_group_id
BACKEND_API_URL=http://localhost:3003
BOT_PORT=3004
```

## 👨‍💻 Maintainability

The codebase follows senior-level best practices:

- Clear naming conventions
- Comprehensive comments
- Type safety
- Error boundaries
- Testable code structure
- Easy to extend and modify
