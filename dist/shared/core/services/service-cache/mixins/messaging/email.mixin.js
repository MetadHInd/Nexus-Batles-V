"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailMixin = void 0;
exports.WithEmail = WithEmail;
class EmailMixin {
    emailService;
    async send(message) {
        if (!this.emailService) {
            throw new Error('EmailService not initialized');
        }
        return await this.emailService.send(message);
    }
    validateConfig() {
        return !!this.emailService;
    }
    async sendWithTemplate(templateName, data, to, subject, from) {
        if (!this.emailService) {
            throw new Error('EmailService not initialized');
        }
        return await this.emailService.sendWithTemplate(templateName, data, to, subject, from);
    }
    async generateTemplate(templateName, data) {
        if (!this.emailService) {
            throw new Error('EmailService not initialized');
        }
        return await this.emailService.generateTemplate(templateName, data);
    }
}
exports.EmailMixin = EmailMixin;
function WithEmail(Base) {
    return class extends Base {
        emailService;
        async send(message) {
            const mixin = new EmailMixin();
            mixin.emailService = this.emailService;
            return await mixin.send(message);
        }
        validateConfig() {
            return !!this.emailService;
        }
        async sendWithTemplate(templateName, data, to, subject, from) {
            const mixin = new EmailMixin();
            mixin.emailService = this.emailService;
            return await mixin.sendWithTemplate(templateName, data, to, subject, from);
        }
        async generateTemplate(templateName, data) {
            const mixin = new EmailMixin();
            mixin.emailService = this.emailService;
            return await mixin.generateTemplate(templateName, data);
        }
    };
}
//# sourceMappingURL=email.mixin.js.map