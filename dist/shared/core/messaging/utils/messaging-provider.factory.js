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
var MessagingProviderFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingProviderFactory = exports.MessagingProvider = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("../email/services/email.service");
const push_service_1 = require("../push/services/push.service");
const sms_service_1 = require("../sms/services/sms.service");
const whatsapp_service_1 = require("../whatsapp/services/whatsapp.service");
var MessagingProvider;
(function (MessagingProvider) {
    MessagingProvider["EMAIL"] = "email";
    MessagingProvider["PUSH"] = "push";
    MessagingProvider["SMS"] = "sms";
    MessagingProvider["WHATSAPP"] = "whatsapp";
})(MessagingProvider || (exports.MessagingProvider = MessagingProvider = {}));
let MessagingProviderFactory = MessagingProviderFactory_1 = class MessagingProviderFactory {
    emailService;
    pushService;
    smsService;
    whatsAppService;
    logger = new common_1.Logger(MessagingProviderFactory_1.name);
    constructor(emailService, pushService, smsService, whatsAppService) {
        this.emailService = emailService;
        this.pushService = pushService;
        this.smsService = smsService;
        this.whatsAppService = whatsAppService;
    }
    getProvider(provider) {
        switch (provider) {
            case MessagingProvider.EMAIL:
                return this.emailService;
            case MessagingProvider.PUSH:
                return this.pushService;
            case MessagingProvider.SMS:
                return this.smsService;
            case MessagingProvider.WHATSAPP:
                return this.whatsAppService;
            default:
                throw new Error(`Unknown messaging provider: ${provider}`);
        }
    }
    getAvailableProviders() {
        return Object.values(MessagingProvider);
    }
};
exports.MessagingProviderFactory = MessagingProviderFactory;
exports.MessagingProviderFactory = MessagingProviderFactory = MessagingProviderFactory_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        push_service_1.PushService,
        sms_service_1.SmsService,
        whatsapp_service_1.WhatsAppService])
], MessagingProviderFactory);
//# sourceMappingURL=messaging-provider.factory.js.map