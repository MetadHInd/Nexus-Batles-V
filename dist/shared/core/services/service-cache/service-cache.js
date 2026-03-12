"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCache = void 0;
const authorization_mixin_1 = require("./mixins/authorization.mixin");
const circuit_breaker_mixin_1 = require("./mixins/circuit-breaker.mixin");
const messaging_mixin_1 = require("./mixins/messaging/messaging.mixin");
const email_mixin_1 = require("./mixins/messaging/email.mixin");
const push_mixin_1 = require("./mixins/messaging/push.mixin");
const sms_mixin_1 = require("./mixins/messaging/sms.mixin");
const whatsapp_mixin_1 = require("./mixins/messaging/whatsapp.mixin");
const database_mixin_1 = require("./mixins/database/database.mixin");
class BaseService {
    emailService;
    pushService;
    smsService;
    whatsAppService;
    messagingFactory;
}
const Mixed = (0, whatsapp_mixin_1.WithWhatsApp)((0, sms_mixin_1.WithSms)((0, push_mixin_1.WithPush)((0, email_mixin_1.WithEmail)((0, messaging_mixin_1.WithMessaging)((0, authorization_mixin_1.WithAuthorization)((0, circuit_breaker_mixin_1.WithCircuitBreaker)(BaseService)))))));
exports.ServiceCache = new Mixed();
exports.ServiceCache.Database = database_mixin_1.Database;
const emailMixinInstance = new email_mixin_1.EmailMixin();
const pushMixinInstance = new push_mixin_1.PushMixin();
const smsMixinInstance = new sms_mixin_1.SmsMixin();
const whatsAppMixinInstance = new whatsapp_mixin_1.WhatsAppMixin();
const Messaging = {
    Email: {
        send: emailMixinInstance.send.bind(emailMixinInstance),
        sendWithTemplate: emailMixinInstance.sendWithTemplate.bind(emailMixinInstance),
        generateTemplate: emailMixinInstance.generateTemplate.bind(emailMixinInstance),
        validateConfig: emailMixinInstance.validateConfig.bind(emailMixinInstance),
    },
    Push: {
        send: pushMixinInstance.send.bind(pushMixinInstance),
        validateConfig: pushMixinInstance.validateConfig.bind(pushMixinInstance),
    },
    SMS: {
        send: smsMixinInstance.send.bind(smsMixinInstance),
        sendToNumbers: smsMixinInstance.sendToNumbers.bind(smsMixinInstance),
        sendWithTemplate: smsMixinInstance.sendWithTemplate.bind(smsMixinInstance),
        validateConfig: smsMixinInstance.validateConfig.bind(smsMixinInstance),
    },
    WhatsApp: {
        send: whatsAppMixinInstance.send.bind(whatsAppMixinInstance),
        sendText: whatsAppMixinInstance.sendText.bind(whatsAppMixinInstance),
        sendInteractive: whatsAppMixinInstance.sendInteractive.bind(whatsAppMixinInstance),
        sendWithAttachment: whatsAppMixinInstance.sendWithAttachment.bind(whatsAppMixinInstance),
        validateConfig: whatsAppMixinInstance.validateConfig.bind(whatsAppMixinInstance),
    },
    getAvailableProviders: exports.ServiceCache.getAvailableProviders.bind(exports.ServiceCache),
    sendByProvider: exports.ServiceCache.sendByProvider.bind(exports.ServiceCache),
};
exports.ServiceCache.Messaging = Messaging;
//# sourceMappingURL=service-cache.js.map