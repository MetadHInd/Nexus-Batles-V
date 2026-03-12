"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhoneNumber = normalizePhoneNumber;
exports.isValidColombianPhone = isValidColombianPhone;
exports.formatPhoneForDisplay = formatPhoneForDisplay;
function normalizePhoneNumber(phone) {
    if (!phone)
        return null;
    let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleaned.startsWith('+')) {
        return cleaned;
    }
    if (cleaned.startsWith('57') && cleaned.length === 12) {
        return '+' + cleaned;
    }
    if (cleaned.startsWith('3') && cleaned.length === 10) {
        return '+57' + cleaned;
    }
    if (cleaned.startsWith('1') && cleaned.length === 11) {
        return '+' + cleaned;
    }
    if (!cleaned.startsWith('+')) {
        if (cleaned.length < 10) {
            console.warn(`⚠️ [PHONE] Short phone number detected: ${phone}`);
        }
        return '+57' + cleaned;
    }
    return cleaned;
}
function isValidColombianPhone(phone) {
    const normalized = normalizePhoneNumber(phone);
    if (!normalized)
        return false;
    const colombianRegex = /^\+57[3][0-9]{9}$/;
    return colombianRegex.test(normalized);
}
function formatPhoneForDisplay(phone) {
    const normalized = normalizePhoneNumber(phone);
    if (!normalized)
        return phone;
    if (normalized.startsWith('+57') && normalized.length === 13) {
        return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6, 9)} ${normalized.slice(9)}`;
    }
    return normalized;
}
console.log('Examples:');
console.log('3175881177 →', normalizePhoneNumber('3175881177'));
console.log('573175881177 →', normalizePhoneNumber('573175881177'));
console.log('+573175881177 →', normalizePhoneNumber('+573175881177'));
console.log('(317) 588-1177 →', normalizePhoneNumber('(317) 588-1177'));
//# sourceMappingURL=phone-normalizer.js.map