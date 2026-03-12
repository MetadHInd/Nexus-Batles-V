"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessageLoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageLoggerService = void 0;
const common_1 = require("@nestjs/common");
let MessageLoggerService = MessageLoggerService_1 = class MessageLoggerService {
    logger = new common_1.Logger(MessageLoggerService_1.name);
    async logMessage(entry) {
        try {
            this.logToConsole(entry);
        }
        catch (error) {
            this.logger.error(`Error logging message: ${error.message}`, error.stack);
        }
    }
    logToConsole(entry) {
        const recipients = Array.isArray(entry.recipient)
            ? entry.recipient.join(', ')
            : entry.recipient;
        const message = `[${entry.channel.toUpperCase()}] ${entry.success ? '✅' : '❌'} ${entry.subject || 'Message'} to ${recipients} - ${entry.status}`;
        if (entry.success) {
            this.logger.log(message);
        }
        else {
            this.logger.error(`${message}: ${entry.error}`);
        }
    }
};
exports.MessageLoggerService = MessageLoggerService;
exports.MessageLoggerService = MessageLoggerService = MessageLoggerService_1 = __decorate([
    (0, common_1.Injectable)()
], MessageLoggerService);
//# sourceMappingURL=message-logger.service.js.map