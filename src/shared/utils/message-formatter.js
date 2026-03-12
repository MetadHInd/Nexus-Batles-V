"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessage = formatMessage;
function formatMessage(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return message.replace(/{(\d+)}/g, function (match, index) {
        return typeof args[index] !== 'undefined' ? String(args[index]) : match;
    });
}
