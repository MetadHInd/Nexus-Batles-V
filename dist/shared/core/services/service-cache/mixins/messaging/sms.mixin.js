"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsMixin = void 0;
exports.WithSms = WithSms;
class SmsMixin {
    smsService;
    async send(message) {
        if (!this.smsService) {
            throw new Error('SmsService not initialized');
        }
        return await this.smsService.send(message);
    }
    async sendToNumbers(phoneNumbers, text, providerId) {
        if (!this.smsService) {
            throw new Error('SmsService not initialized');
        }
        const message = {
            to: phoneNumbers,
            body: text,
            providerId,
        };
        return await this.smsService.send(message);
    }
    async sendWithTemplate(templateName, data, phoneNumbers) {
        if (!this.smsService) {
            throw new Error('SmsService not initialized');
        }
        const text = `Template: ${templateName}`;
        return await this.sendToNumbers(phoneNumbers, text);
    }
    validateConfig() {
        return !!this.smsService;
    }
}
exports.SmsMixin = SmsMixin;
function WithSms(Base) {
    return class extends Base {
        smsService;
        async send(message) {
            const mixin = new SmsMixin();
            mixin.smsService = this.smsService;
            return await mixin.send(message);
        }
        async sendToNumbers(phoneNumbers, text, providerId) {
            const mixin = new SmsMixin();
            mixin.smsService = this.smsService;
            return await mixin.sendToNumbers(phoneNumbers, text, providerId);
        }
        validateConfig() {
            return !!this.smsService;
        }
    };
}
//# sourceMappingURL=sms.mixin.js.map