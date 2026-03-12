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
var TwilioWebhookConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioWebhookConfigService = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = require("twilio");
let TwilioWebhookConfigService = TwilioWebhookConfigService_1 = class TwilioWebhookConfigService {
    logger = new common_1.Logger(TwilioWebhookConfigService_1.name);
    client;
    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (accountSid && authToken) {
            this.client = new twilio_1.Twilio(accountSid, authToken);
        }
    }
    getBaseUrl() {
        if (process.env.API_BASE_URL) {
            return process.env.API_BASE_URL;
        }
        if (process.env.PRODUCTION_URL) {
            return process.env.PRODUCTION_URL;
        }
        if (process.env.NODE_ENV === 'production') {
            this.logger.warn('⚠️ API_BASE_URL not set in production environment');
            return 'https://api.tu-dominio.com';
        }
        const port = process.env.PORT || 3000;
        return `http://localhost:${port}`;
    }
    getWebhookUrls() {
        const baseUrl = this.getBaseUrl();
        const unifiedWebhook = `${baseUrl}/sms/webhook`;
        return {
            baseUrl,
            unified: unifiedWebhook,
            statusCallback: unifiedWebhook,
            incomingSms: unifiedWebhook,
            conversationsWebhook: unifiedWebhook,
            healthCheck: `${baseUrl}/sms/webhook/health`,
        };
    }
    async configurePhoneNumberWebhooks(phoneNumber) {
        try {
            const phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;
            if (!phone) {
                throw new Error('Phone number not provided and TWILIO_PHONE_NUMBER not set');
            }
            this.logger.log(`📞 Configuring webhooks for phone number: ${phone}`);
            const phoneNumbers = await this.client.incomingPhoneNumbers.list({
                phoneNumber: phone,
            });
            if (phoneNumbers.length === 0) {
                throw new Error(`Phone number ${phone} not found in Twilio account`);
            }
            const phoneNumberSid = phoneNumbers[0].sid;
            const urls = this.getWebhookUrls();
            const updatedNumber = await this.client
                .incomingPhoneNumbers(phoneNumberSid)
                .update({
                smsUrl: urls.incomingSms,
                smsMethod: 'POST',
                statusCallback: urls.statusCallback,
                statusCallbackMethod: 'POST',
            });
            this.logger.log(`✅ Webhooks configured successfully for ${phone}`);
            return {
                success: true,
                phoneNumber: phone,
                phoneSid: phoneNumberSid,
                webhooks: {
                    incomingSms: urls.incomingSms,
                    statusCallback: urls.statusCallback,
                },
                updatedAt: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`❌ Error configuring phone webhooks: ${error.message}`);
            throw error;
        }
    }
    async configureMessagingServiceWebhooks(messagingServiceSid) {
        try {
            const serviceSid = messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;
            if (!serviceSid) {
                this.logger.warn('⚠️ No Messaging Service SID provided, skipping');
                return { success: false, reason: 'No Messaging Service SID' };
            }
            this.logger.log(`📨 Configuring webhooks for Messaging Service: ${serviceSid}`);
            const urls = this.getWebhookUrls();
            const updatedService = await this.client.messaging.v1
                .services(serviceSid)
                .update({
                statusCallback: urls.statusCallback,
                inboundRequestUrl: urls.incomingSms,
                inboundMethod: 'POST',
            });
            this.logger.log(`✅ Messaging Service webhooks configured successfully`);
            return {
                success: true,
                messagingServiceSid: serviceSid,
                webhooks: {
                    incomingSms: urls.incomingSms,
                    statusCallback: urls.statusCallback,
                },
                updatedAt: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`❌ Error configuring Messaging Service webhooks: ${error.message}`);
            throw error;
        }
    }
    async configureConversationsWebhooks(conversationServiceSid) {
        try {
            const serviceSid = conversationServiceSid || 'default';
            this.logger.log(`💬 Configuring webhooks for Conversations Service: ${serviceSid}`);
            const urls = this.getWebhookUrls();
            const webhook = await this.client.conversations.v1.configuration
                .webhooks()
                .update({
                postWebhookUrl: urls.conversationsWebhook,
                method: 'POST',
                filters: ['onMessageAdded', 'onMessageUpdated'],
            });
            this.logger.log(`✅ Conversations webhooks configured successfully`);
            return {
                success: true,
                conversationServiceSid: serviceSid,
                webhooks: {
                    postWebhook: urls.conversationsWebhook,
                    filters: ['onMessageAdded', 'onMessageUpdated'],
                },
                updatedAt: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error(`❌ Error configuring Conversations webhooks: ${error.message}`);
            throw error;
        }
    }
    async configureAllWebhooks(config) {
        this.logger.log('🚀 Starting automatic webhook configuration...');
        const phoneNumber = config?.phoneNumber || process.env.TWILIO_PHONE_NUMBER;
        const messagingServiceSid = config?.messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;
        const conversationServiceSid = config?.conversationServiceSid;
        this.logger.log(`📱 Phone Number: ${phoneNumber}`);
        if (messagingServiceSid) {
            this.logger.log(`📦 Messaging Service SID: ${messagingServiceSid}`);
        }
        if (conversationServiceSid) {
            this.logger.log(`💬 Conversation Service SID: ${conversationServiceSid}`);
        }
        const results = {
            baseUrl: this.getBaseUrl(),
            phoneNumber: null,
            messagingService: null,
            conversations: null,
            timestamp: new Date().toISOString(),
        };
        try {
            try {
                results.phoneNumber = await this.configurePhoneNumberWebhooks(phoneNumber);
            }
            catch (error) {
                this.logger.warn(`Phone number webhook config failed: ${error.message}`);
                results.phoneNumber = { success: false, error: error.message };
            }
            try {
                results.messagingService =
                    await this.configureMessagingServiceWebhooks(messagingServiceSid);
            }
            catch (error) {
                this.logger.warn(`Messaging Service webhook config failed: ${error.message}`);
                results.messagingService = { success: false, error: error.message };
            }
            try {
                results.conversations = await this.configureConversationsWebhooks(conversationServiceSid);
            }
            catch (error) {
                this.logger.warn(`Conversations webhook config failed: ${error.message}`);
                results.conversations = { success: false, error: error.message };
            }
            this.logger.log('✅ Webhook configuration completed');
            return results;
        }
        catch (error) {
            this.logger.error(`❌ Error in webhook configuration: ${error.message}`);
            throw error;
        }
    }
    async verifyWebhooks(phoneNumber) {
        try {
            const phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;
            if (!phone) {
                throw new Error('Phone number not provided');
            }
            const phoneNumbers = await this.client.incomingPhoneNumbers.list({
                phoneNumber: phone,
            });
            if (phoneNumbers.length === 0) {
                throw new Error(`Phone number ${phone} not found`);
            }
            const number = phoneNumbers[0];
            return {
                phoneNumber: phone,
                phoneSid: number.sid,
                currentWebhooks: {
                    smsUrl: number.smsUrl,
                    smsMethod: number.smsMethod,
                    statusCallback: number.statusCallback,
                    statusCallbackMethod: number.statusCallbackMethod,
                },
                expectedWebhooks: this.getWebhookUrls(),
            };
        }
        catch (error) {
            this.logger.error(`Error verifying webhooks: ${error.message}`);
            throw error;
        }
    }
};
exports.TwilioWebhookConfigService = TwilioWebhookConfigService;
exports.TwilioWebhookConfigService = TwilioWebhookConfigService = TwilioWebhookConfigService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TwilioWebhookConfigService);
//# sourceMappingURL=twilio-webhook-config.service.js.map