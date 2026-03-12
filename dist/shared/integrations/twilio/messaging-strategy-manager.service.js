"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MessagingStrategyManager_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingStrategyManager = void 0;
const common_1 = require("@nestjs/common");
const twilio_strategy_1 = require("./strategies/twilio.strategy");
const prisma_service_1 = require("../../database/prisma.service");
const firestore_messaging_service_1 = require("../../database/firestore-messaging.service");
const firestore_message_interface_1 = require("../../database/interfaces/firestore-message.interface");
let MessagingStrategyManager = MessagingStrategyManager_1 = class MessagingStrategyManager {
    prisma;
    twilioStrategy;
    firestoreMessaging;
    logger = new common_1.Logger(MessagingStrategyManager_1.name);
    strategies = new Map();
    constructor(prisma, twilioStrategy, firestoreMessaging) {
        this.prisma = prisma;
        this.twilioStrategy = twilioStrategy;
        this.firestoreMessaging = firestoreMessaging;
        this.registerStrategy('twilio', twilioStrategy);
    }
    registerStrategy(name, strategy) {
        this.strategies.set(name, strategy);
        this.logger.log(`Strategy registered: ${name}`);
    }
    getStrategy(name) {
        return this.strategies.get(name);
    }
    async getServiceConfig(serviceId) {
        try {
            const config = {
                serviceId,
                serviceName: 'default',
                provider: 'twilio',
                phoneNumberId: process.env.TWILIO_PHONE_NUMBER || '',
                credentials: {
                    accountSid: process.env.TWILIO_ACCOUNT_SID,
                    authToken: process.env.TWILIO_AUTH_TOKEN,
                },
            };
            return config;
        }
        catch (error) {
            this.logger.error(`Error getting service config: ${error.message}`);
            return null;
        }
    }
    async getPhoneNumber(serviceId) {
        try {
            return {
                id: '1',
                phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
                provider: 'twilio',
                serviceId,
                isActive: true,
                capabilities: {
                    sms: true,
                    voice: true,
                    whatsapp: true,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error getting phone number: ${error.message}`);
            return null;
        }
    }
    async sendSms(message, serviceId = 'default') {
        try {
            const config = await this.getServiceConfig(serviceId);
            if (!config) {
                return {
                    success: false,
                    error: 'Service configuration not found',
                };
            }
            const strategy = this.getStrategy(config.provider);
            if (!strategy) {
                return {
                    success: false,
                    error: `Strategy not found: ${config.provider}`,
                };
            }
            if (!strategy.validateConfig(config)) {
                return {
                    success: false,
                    error: 'Invalid configuration',
                };
            }
            const result = await strategy.sendSms(message, config);
            try {
                const conversationId = `sms_${message.to}_${config.phoneNumberId}`;
                await this.firestoreMessaging.saveOutboundMessage({
                    conversationId,
                    channel: firestore_message_interface_1.MessageChannel.SMS,
                    from: config.phoneNumberId,
                    to: Array.isArray(message.to) ? message.to[0] : message.to,
                    body: message.body,
                    serviceId,
                    provider: config.provider,
                    providerMessageId: result.messageId,
                    metadata: message.metadata,
                });
            }
            catch (firestoreError) {
                this.logger.error(`Error saving SMS to Firestore: ${firestoreError.message}`);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error in sendSms: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async sendWhatsApp(message, serviceId = 'default') {
        try {
            const config = await this.getServiceConfig(serviceId);
            if (!config) {
                return {
                    success: false,
                    error: `Configuration not found for service: ${serviceId}`,
                };
            }
            const strategy = this.getStrategy(config.provider);
            if (!strategy) {
                return {
                    success: false,
                    error: `Strategy not found: ${config.provider}`,
                };
            }
            if (!strategy.validateConfig(config)) {
                return {
                    success: false,
                    error: 'Invalid configuration',
                };
            }
            const result = await strategy.sendWhatsApp(message, config);
            try {
                const conversationId = `whatsapp_${message.to}_${config.phoneNumberId}`;
                await this.firestoreMessaging.saveOutboundMessage({
                    conversationId,
                    channel: firestore_message_interface_1.MessageChannel.WHATSAPP,
                    from: config.phoneNumberId,
                    to: message.to,
                    body: message.body,
                    serviceId,
                    provider: config.provider,
                    providerMessageId: result.messageId,
                    metadata: message.metadata,
                });
            }
            catch (firestoreError) {
                this.logger.error(`Error saving WhatsApp to Firestore: ${firestoreError.message}`);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Error in sendWhatsApp: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    listStrategies() {
        return Array.from(this.strategies.keys());
    }
    hasStrategy(name) {
        return this.strategies.has(name);
    }
};
exports.MessagingStrategyManager = MessagingStrategyManager;
exports.MessagingStrategyManager = MessagingStrategyManager = MessagingStrategyManager_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        twilio_strategy_1.TwilioStrategy,
        firestore_messaging_service_1.FirestoreMessagingService])
], MessagingStrategyManager);
//# sourceMappingURL=messaging-strategy-manager.service.js.map