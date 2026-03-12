"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationFormatter = void 0;
class NotificationFormatter {
    static validatePhoneNumber(phone) {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        if (cleanPhone.replace(/\+/g, '').length < 10) {
            return null;
        }
        let formattedPhone = cleanPhone;
        if (!cleanPhone.startsWith('+')) {
            const defaultCountryCode = process.env.DEFAULT_COUNTRY_CODE || '+1';
            formattedPhone = defaultCountryCode + cleanPhone;
        }
        return { type: 'SMS', value: formattedPhone };
    }
    static validatePlayerId(playerId) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const firebaseRegex = /^[a-zA-Z0-9_-]+:[a-zA-Z0-9_-]+$/;
        if (uuidRegex.test(playerId) || firebaseRegex.test(playerId)) {
            return { type: 'PUSH', value: playerId };
        }
        return null;
    }
    static validateTokenType(token) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(token)) {
            return { type: 'EMAIL', value: token };
        }
        const phoneValidation = this.validatePhoneNumber(token);
        if (phoneValidation) {
            return phoneValidation;
        }
        return { type: 'PUSH', value: token };
    }
}
exports.NotificationFormatter = NotificationFormatter;
//# sourceMappingURL=notification-formatter.util.js.map