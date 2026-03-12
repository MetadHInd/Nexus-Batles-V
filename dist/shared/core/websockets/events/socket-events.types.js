"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEventDirection = exports.SocketEventTypes = void 0;
var SocketEventTypes;
(function (SocketEventTypes) {
    SocketEventTypes["USER_MESSAGE"] = "USER_MESSAGE";
    SocketEventTypes["USER_JOIN"] = "USER_JOIN";
    SocketEventTypes["USER_LEAVE"] = "USER_LEAVE";
})(SocketEventTypes || (exports.SocketEventTypes = SocketEventTypes = {}));
var SocketEventDirection;
(function (SocketEventDirection) {
    SocketEventDirection["IN"] = "in";
    SocketEventDirection["OUT"] = "out";
    SocketEventDirection["BOTH"] = "both";
})(SocketEventDirection || (exports.SocketEventDirection = SocketEventDirection = {}));
//# sourceMappingURL=socket-events.types.js.map