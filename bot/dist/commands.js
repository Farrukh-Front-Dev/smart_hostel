"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommands = setupCommands;
const commandHandlers_1 = require("./handlers/commandHandlers");
const callbackHandlers_1 = require("./handlers/callbackHandlers");
const messageHandlers_1 = require("./handlers/messageHandlers");
/**
 * Setup all bot commands and handlers
 * Clean architecture with separation of concerns
 */
function setupCommands(bot) {
    // Command handlers
    bot.start((ctx) => commandHandlers_1.CommandHandlers.handleStart(ctx));
    bot.help((ctx) => commandHandlers_1.CommandHandlers.handleHelp(ctx));
    bot.command('oplata', (ctx) => commandHandlers_1.CommandHandlers.handleOplata(ctx));
    bot.command('cancel', (ctx) => commandHandlers_1.CommandHandlers.handleCancel(ctx));
    bot.command('today', (ctx) => commandHandlers_1.CommandHandlers.handleToday(ctx));
    bot.command('tomorrow', (ctx) => commandHandlers_1.CommandHandlers.handleTomorrow(ctx));
    bot.command('groupid', (ctx) => commandHandlers_1.CommandHandlers.handleGroupId(ctx));
    bot.command('invite', (ctx) => commandHandlers_1.CommandHandlers.handleInvite(ctx));
    // Callback query handler (inline buttons)
    bot.on('callback_query', (ctx) => callbackHandlers_1.CallbackHandlers.handleCallback(ctx, bot));
    // Message handlers
    bot.on('text', (ctx) => messageHandlers_1.MessageHandlers.handleText(ctx));
    bot.on('photo', (ctx) => messageHandlers_1.MessageHandlers.handlePhoto(ctx, bot));
    bot.on('document', (ctx) => messageHandlers_1.MessageHandlers.handleDocument(ctx, bot));
}
//# sourceMappingURL=commands.js.map