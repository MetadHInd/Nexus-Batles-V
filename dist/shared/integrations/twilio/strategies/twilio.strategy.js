"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TwilioStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioStrategy = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = require("twilio");
let TwilioStrategy = TwilioStrategy_1 = class TwilioStrategy {
    name = 'twilio';
    type = 'both';
    logger = new common_1.Logger(TwilioStrategy_1.name);
    clientCache = new Map();
    getClient(config) {
        const key = `${config.credentials.accountSid}`;
        if (!this.clientCache.has(key)) {
            const client = new twilio_1.Twilio(config.credentials.accountSid, config.credentials.authToken);
            this.clientCache.set(key, client);
        }
        return this.clientCache.get(key);
    }
    validateConfig(config) {
        return !!(config.credentials.accountSid &&
            config.credentials.authToken &&
            config.phoneNumberId);
    }
    async sendSms(message, config) {
        try {
            if (!config) {
                throw new Error('MessagingConfig is required');
            }
            if (!this.validateConfig(config)) {
                throw new Error('Invalid Twilio configuration');
            }
            const client = this.getClient(config);
            const twilioMessage = await client.messages.create({
                body: message.body,
                to: Array.isArray(message.to) ? message.to[0] : message.to,
                from: message.from || config.phoneNumberId,
                ...(message.metadata?.mediaUrl && { mediaUrl: [message.metadata.mediaUrl] }),
            });
            this.logger.log(`SMS sent via Twilio: ${twilioMessage.sid}`);
            return {
                success: true,
                messageId: twilioMessage.sid,
                details: {
                    status: twilioMessage.status,
                    to: twilioMessage.to,
                    from: twilioMessage.from,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error sending SMS via Twilio: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async sendBulkSms(messages, config) {
        const results = [];
        for (const message of messages) {
            const result = await this.sendSms(message, config);
            results.push(result);
        }
        return results;
    }
    async sendWhatsApp(message, config) {
        try {
            if (!config) {
                throw new Error('MessagingConfig is required');
            }
            if (!this.validateConfig(config)) {
                throw new Error('Invalid Twilio configuration');
            }
            const client = this.getClient(config);
            const whatsappTo = message.to.startsWith('whatsapp:')
                ? message.to
                : `whatsapp:${message.to}`;
            const whatsappFrom = config.phoneNumberId.startsWith('whatsapp:')
                ? config.phoneNumberId
                : `whatsapp:${config.phoneNumberId}`;
            const twilioMessage = await client.messages.create({
                body: message.body,
                to: whatsappTo,
                from: whatsappFrom,
                ...(message.mediaUrl && { mediaUrl: [message.mediaUrl] }),
            });
            this.logger.log(`WhatsApp sent via Twilio: ${twilioMessage.sid}`);
            return {
                success: true,
                messageId: twilioMessage.sid,
                details: {
                    status: twilioMessage.status,
                    to: twilioMessage.to,
                    from: twilioMessage.from,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error sending WhatsApp via Twilio: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async sendInteractive(message, config) {
        this.logger.warn('Interactive WhatsApp messages not yet implemented');
        return {
            success: false,
            error: 'Interactive messages not implemented',
        };
    }
};
exports.TwilioStrategy = TwilioStrategy;
exports.TwilioStrategy = TwilioStrategy = TwilioStrategy_1 = __decorate([
    (0, common_1.Injectable)()
], TwilioStrategy);
//# sourceMappingURL=twilio.strategy.js.map