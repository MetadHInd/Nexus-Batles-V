"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppMixin = void 0;
exports.WithWhatsApp = WithWhatsApp;
class WhatsAppMixin {
    whatsAppService;
    async send(message) {
        if (!this.whatsAppService) {
            throw new Error('WhatsAppService not initialized');
        }
        return await this.whatsAppService.send(message);
    }
    async sendText(to, text) {
        if (!this.whatsAppService) {
            throw new Error('WhatsAppService not initialized');
        }
        const message = {
            to,
            body: text,
            type: 'text',
        };
        return await this.whatsAppService.send(message);
    }
    async sendInteractive(message) {
        if (!this.whatsAppService) {
            throw new Error('WhatsAppService not initialized');
        }
        return await this.whatsAppService.sendInteractive(message);
    }
    async sendWithAttachment(to, text, attachmentUrl, type) {
        if (!this.whatsAppService) {
            throw new Error('WhatsAppService not initialized');
        }
        const message = {
            to,
            body: text,
            type,
            mediaUrl: attachmentUrl,
        };
        return await this.whatsAppService.send(message);
    }
    validateConfig() {
        return !!this.whatsAppService;
    }
}
exports.WhatsAppMixin = WhatsAppMixin;
function WithWhatsApp(Base) {
    return class extends Base {
        whatsAppService;
        async send(message) {
            const mixin = new WhatsAppMixin();
            mixin.whatsAppService = this.whatsAppService;
            return await mixin.send(message);
        }
        async sendText(to, text) {
            const mixin = new WhatsAppMixin();
            mixin.whatsAppService = this.whatsAppService;
            return await mixin.sendText(to, text);
        }
        async sendInteractive(message) {
            const mixin = new WhatsAppMixin();
            mixin.whatsAppService = this.whatsAppService;
            return await mixin.sendInteractive(message);
        }
        validateConfig() {
            return !!this.whatsAppService;
        }
    };
}
//# sourceMappingURL=whatsapp.mixin.js.map