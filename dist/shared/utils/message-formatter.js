"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessage = formatMessage;
function formatMessage(message, ...args) {
    return message.replace(/{(\d+)}/g, (match, index) => {
        return typeof args[index] !== 'undefined' ? String(args[index]) : match;
    });
}
//# sourceMappingURL=message-formatter.js.map