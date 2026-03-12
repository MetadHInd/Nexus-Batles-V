"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCache = void 0;
var authorization_mixin_1 = require("./mixins/authorization.mixin");
var circuit_breaker_mixin_1 = require("./mixins/circuit-breaker.mixin");
var messaging_mixin_1 = require("./mixins/messaging/messaging.mixin");
var email_mixin_1 = require("./mixins/messaging/email.mixin");
var push_mixin_1 = require("./mixins/messaging/push.mixin");
var sms_mixin_1 = require("./mixins/messaging/sms.mixin");
var whatsapp_mixin_1 = require("./mixins/messaging/whatsapp.mixin");
var database_mixin_1 = require("./mixins/database/database.mixin");
/**
 * ServiceCache con sistema de mensajería completo
 * Incluye: Database, Email, Push, SMS, WhatsApp
 */
var BaseService = /** @class */ (function () {
    function BaseService() {
    }
    return BaseService;
}());
// Aplicar todos los mixins de mensajería
var Mixed = (0, whatsapp_mixin_1.WithWhatsApp)((0, sms_mixin_1.WithSms)((0, push_mixin_1.WithPush)((0, email_mixin_1.WithEmail)((0, messaging_mixin_1.WithMessaging)((0, authorization_mixin_1.WithAuthorization)((0, circuit_breaker_mixin_1.WithCircuitBreaker)(BaseService)))))));
exports.ServiceCache = new Mixed();
exports.ServiceCache.Database = database_mixin_1.Database;
// Crear instancias de los mixins
var emailMixinInstance = new email_mixin_1.EmailMixin();
var pushMixinInstance = new push_mixin_1.PushMixin();
var smsMixinInstance = new sms_mixin_1.SmsMixin();
var whatsAppMixinInstance = new whatsapp_mixin_1.WhatsAppMixin();
var Messaging = {
    // Namespace Email
    Email: {
        send: emailMixinInstance.send.bind(emailMixinInstance),
        sendWithTemplate: emailMixinInstance.sendWithTemplate.bind(emailMixinInstance),
        generateTemplate: emailMixinInstance.generateTemplate.bind(emailMixinInstance),
        validateConfig: emailMixinInstance.validateConfig.bind(emailMixinInstance),
    },
    // Namespace Push
    Push: {
        send: pushMixinInstance.send.bind(pushMixinInstance),
        validateConfig: pushMixinInstance.validateConfig.bind(pushMixinInstance),
    },
    // Namespace SMS
    SMS: {
        send: smsMixinInstance.send.bind(smsMixinInstance),
        sendToNumbers: smsMixinInstance.sendToNumbers.bind(smsMixinInstance),
        sendWithTemplate: smsMixinInstance.sendWithTemplate.bind(smsMixinInstance),
        validateConfig: smsMixinInstance.validateConfig.bind(smsMixinInstance),
    },
    // Namespace WhatsApp
    WhatsApp: {
        send: whatsAppMixinInstance.send.bind(whatsAppMixinInstance),
        sendText: whatsAppMixinInstance.sendText.bind(whatsAppMixinInstance),
        sendInteractive: whatsAppMixinInstance.sendInteractive.bind(whatsAppMixinInstance),
        sendWithAttachment: whatsAppMixinInstance.sendWithAttachment.bind(whatsAppMixinInstance),
        validateConfig: whatsAppMixinInstance.validateConfig.bind(whatsAppMixinInstance),
    },
    // Métodos utilitarios globales
    getAvailableProviders: exports.ServiceCache.getAvailableProviders.bind(exports.ServiceCache),
    sendByProvider: exports.ServiceCache.sendByProvider.bind(exports.ServiceCache),
};
exports.ServiceCache.Messaging = Messaging;
