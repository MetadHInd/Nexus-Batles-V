"use strict";
/**
 * Phone Number Normalization Utility
 *
 * Ensures all phone numbers are stored in the same format:
 * International format with + (e.g., +573175881177)
 *
 * This prevents duplicate users with different phone formats.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhoneNumber = normalizePhoneNumber;
exports.isValidColombianPhone = isValidColombianPhone;
exports.formatPhoneForDisplay = formatPhoneForDisplay;
/**
 * Normalize phone number to international format
 *
 * @param phone - Phone number in any format
 * @returns Normalized phone number with country code
 */
function normalizePhoneNumber(phone) {
    if (!phone)
        return null;
    // Remove all non-digit characters except +
    var cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    // If already has + at start, return as is
    if (cleaned.startsWith('+')) {
        return cleaned;
    }
    // If starts with 57 and has 12 digits (Colombian format without +)
    if (cleaned.startsWith('57') && cleaned.length === 12) {
        return '+' + cleaned;
    }
    // If starts with 3 and has 10 digits (Colombian local number)
    if (cleaned.startsWith('3') && cleaned.length === 10) {
        return '+57' + cleaned;
    }
    // If starts with 1 and has 10 digits (US/Canada)
    if (cleaned.startsWith('1') && cleaned.length === 11) {
        return '+' + cleaned;
    }
    // Default: assume Colombian number, add +57
    if (!cleaned.startsWith('+')) {
        // If it's a short number (less than 10 digits), might be invalid
        if (cleaned.length < 10) {
            console.warn("\u26A0\uFE0F [PHONE] Short phone number detected: ".concat(phone));
        }
        return '+57' + cleaned;
    }
    return cleaned;
}
/**
 * Validate if phone number is valid Colombian format
 */
function isValidColombianPhone(phone) {
    var normalized = normalizePhoneNumber(phone);
    if (!normalized)
        return false;
    // Colombian numbers: +57 followed by 10 digits starting with 3
    var colombianRegex = /^\+57[3][0-9]{9}$/;
    return colombianRegex.test(normalized);
}
/**
 * Format phone number for display (optional)
 */
function formatPhoneForDisplay(phone) {
    var normalized = normalizePhoneNumber(phone);
    if (!normalized)
        return phone;
    // +57 3175881177 → +57 317 588 1177
    if (normalized.startsWith('+57') && normalized.length === 13) {
        return "".concat(normalized.slice(0, 3), " ").concat(normalized.slice(3, 6), " ").concat(normalized.slice(6, 9), " ").concat(normalized.slice(9));
    }
    return normalized;
}
// Example usage:
console.log('Examples:');
console.log('3175881177 →', normalizePhoneNumber('3175881177'));
console.log('573175881177 →', normalizePhoneNumber('573175881177'));
console.log('+573175881177 →', normalizePhoneNumber('+573175881177'));
console.log('(317) 588-1177 →', normalizePhoneNumber('(317) 588-1177'));
