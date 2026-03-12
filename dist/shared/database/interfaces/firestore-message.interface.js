"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatus = exports.MessageChannel = exports.MessageDirection = void 0;
var MessageDirection;
(function (MessageDirection) {
    MessageDirection["INBOUND"] = "inbound";
    MessageDirection["OUTBOUND"] = "outbound";
})(MessageDirection || (exports.MessageDirection = MessageDirection = {}));
var MessageChannel;
(function (MessageChannel) {
    MessageChannel["SMS"] = "sms";
    MessageChannel["WHATSAPP"] = "whatsapp";
    MessageChannel["EMAIL"] = "email";
    MessageChannel["PUSH"] = "push";
    MessageChannel["WEB"] = "web";
    MessageChannel["VOICE"] = "voice";
})(MessageChannel || (exports.MessageChannel = MessageChannel = {}));
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["PENDING"] = "pending";
    MessageStatus["SENT"] = "sent";
    MessageStatus["DELIVERED"] = "delivered";
    MessageStatus["READ"] = "read";
    MessageStatus["FAILED"] = "failed";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
//# sourceMappingURL=firestore-message.interface.js.map