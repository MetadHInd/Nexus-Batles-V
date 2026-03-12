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
const Twilio = require("twilio");
let TwilioWebhookConfigService = TwilioWebhookConfigService_1 = class TwilioWebhookConfigService {
    logger = new common_1.Logger(TwilioWebhookConfigService_1.name);
    client;
    baseUrl;
    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (!accountSid || !authToken) {
            throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment variables');
        }
        this.client = new Twilio.Twilio(accountSid, authToken);
        this.baseUrl =
            process.env.API_BASE_URL ||
                process.env.BASE_URL ||
                'http://localhost:3000';
        this.logger.log(`Twilio Webhook Config Service initialized with base URL: ${this.baseUrl}`);
    }
    getWebhookUrls() {
        const baseUrl = this.baseUrl.replace(/\/$/, '');
        return {
            baseUrl,
            statusCallback: `${baseUrl}/api/messaging/sms/webhooks/twilio/status`,
            incomingSms: `${baseUrl}/api/messaging/sms/webhooks/twilio/incoming`,
            conversationsWebhook: `${baseUrl}/api/messaging/sms/webhooks/twilio/conversations`,
            healthCheck: `${baseUrl}/api/messaging/sms/webhooks/health`,
        };
    }
    async configurePhoneNumberWebhooks(phoneNumber) {
        try {
            const phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;
            if (!phone) {
                throw new Error('Phone number not provided and TWILIO_PHONE_NUMBER not set');
            }
            this.logger.log(`Configuring webhooks for phone number: ${phone}`);
            const urls = this.getWebhookUrls();
            const phoneNumbers = await this.client.incomingPhoneNumbers.list({
                phoneNumber: phone,
                limit: 1,
            });
            if (phoneNumbers.length === 0) {
                throw new Error(`Phone number ${phone} not found in your Twilio account`);
            }
            const twilioPhone = phoneNumbers[0];
            const updated = await this.client
                .incomingPhoneNumbers(twilioPhone.sid)
                .update({
                smsUrl: urls.incomingSms,
                smsMethod: 'POST',
                statusCallback: urls.statusCallback,
                statusCallbackMethod: 'POST',
            });
            this.logger.log(`✅ Phone webhooks configured successfully for ${phone}`);
            return {
                success: true,
                phoneNumber: phone,
                phoneSid: twilioPhone.sid,
                webhooks: {
                    incomingSms: urls.incomingSms,
                    statusCallback: urls.statusCallback,
                },
                friendlyName: updated.friendlyName,
            };
        }
        catch (error) {
            this.logger.error(`Error configuring phone webhooks: ${error.message}`);
            throw error;
        }
    }
    async configureMessagingServiceWebhooks(messagingServiceSid) {
        try {
            const serviceSid = messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;
            if (!serviceSid) {
                this.logger.warn('No Messaging Service SID provided, skipping Messaging Service webhook configuration');
                return {
                    success: false,
                    message: 'No Messaging Service SID provided',
                    skipped: true,
                };
            }
            this.logger.log(`Configuring webhooks for Messaging Service: ${serviceSid}`);
            const urls = this.getWebhookUrls();
            const updated = await this.client.messaging.v1
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
                friendlyName: updated.friendlyName,
                webhooks: {
                    statusCallback: urls.statusCallback,
                    inboundRequestUrl: urls.incomingSms,
                },
            };
        }
        catch (error) {
            this.logger.error(`Error configuring Messaging Service webhooks: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async configureConversationsWebhooks(conversationServiceSid) {
        try {
            let serviceSid = conversationServiceSid;
            if (!serviceSid) {
                this.logger.log('No Conversation Service SID provided, fetching default...');
                const services = await this.client.conversations.v1.services.list({
                    limit: 1,
                });
                if (services.length === 0) {
                    throw new Error('No Conversation Service found. Create one in Twilio Console first.');
                }
                serviceSid = services[0].sid;
                this.logger.log(`Using default Conversation Service: ${serviceSid}`);
            }
            const urls = this.getWebhookUrls();
            await this.client.conversations.v1
                .services(serviceSid)
                .configuration()
                .fetch();
            this.logger.log(`✅ Conversations service verified successfully`);
            this.logger.warn(`⚠️ Conversations webhooks must be configured manually in Twilio Console`);
            this.logger.log(`Console URL: https://console.twilio.com/us1/develop/conversations/manage/services/${serviceSid}`);
            return {
                success: true,
                conversationServiceSid: serviceSid,
                webhook: urls.conversationsWebhook,
                note: 'Webhook URL must be configured manually in Twilio Console for Conversations',
                consoleUrl: `https://console.twilio.com/us1/develop/conversations/manage/services/${serviceSid}`,
                manualSteps: [
                    '1. Go to Twilio Console → Conversations → Services',
                    '2. Select your service',
                    '3. Go to Webhooks tab',
                    `4. Set Post-Event Webhook URL to: ${urls.conversationsWebhook}`,
                    '5. Enable events: onMessageAdded, onDeliveryUpdated',
                    '6. Method: POST',
                    '7. Click Save',
                ],
            };
        }
        catch (error) {
            this.logger.error(`Error configuring Conversations webhooks: ${error.message}`);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async configureAllWebhooks() {
        this.logger.log('🚀 Starting automatic webhook configuration for all services...');
        const results = {
            baseUrl: this.baseUrl,
            phoneNumber: null,
            messagingService: null,
            conversations: null,
            timestamp: new Date().toISOString(),
        };
        try {
            results.phoneNumber =
                await this.configurePhoneNumberWebhooks();
        }
        catch (error) {
            this.logger.error(`Phone configuration failed: ${error.message}`);
            results.phoneNumber = { success: false, error: error.message };
        }
        try {
            results.messagingService =
                await this.configureMessagingServiceWebhooks();
        }
        catch (error) {
            this.logger.error(`Messaging Service configuration failed: ${error.message}`);
            results.messagingService = { success: false, error: error.message };
        }
        try {
            results.conversations =
                await this.configureConversationsWebhooks();
        }
        catch (error) {
            this.logger.error(`Conversations configuration failed: ${error.message}`);
            results.conversations = { success: false, error: error.message };
        }
        this.logger.log('✅ Webhook configuration completed');
        return results;
    }
    async verifyWebhooks() {
        try {
            const phone = process.env.TWILIO_PHONE_NUMBER;
            if (!phone) {
                throw new Error('TWILIO_PHONE_NUMBER not set');
            }
            const phoneNumbers = await this.client.incomingPhoneNumbers.list({
                phoneNumber: phone,
                limit: 1,
            });
            if (phoneNumbers.length === 0) {
                throw new Error(`Phone number ${phone} not found`);
            }
            const twilioPhone = phoneNumbers[0];
            const expectedUrls = this.getWebhookUrls();
            return {
                phoneNumber: phone,
                currentWebhooks: {
                    smsUrl: twilioPhone.smsUrl,
                    statusCallback: twilioPhone.statusCallback,
                },
                expectedWebhooks: {
                    smsUrl: expectedUrls.incomingSms,
                    statusCallback: expectedUrls.statusCallback,
                },
                isConfigured: twilioPhone.smsUrl === expectedUrls.incomingSms &&
                    twilioPhone.statusCallback === expectedUrls.statusCallback,
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