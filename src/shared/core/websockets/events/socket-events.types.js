"use strict";
/**
 * Definición de todos los tipos de eventos y payloads para WebSockets.
 * Agrega aquí nuevos eventos y sus tipos de datos.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEventDirection = exports.SocketEventTypes = void 0;
// Ejemplo: Evento de mensaje de usuario
var SocketEventTypes;
(function (SocketEventTypes) {
    SocketEventTypes["USER_MESSAGE"] = "USER_MESSAGE";
    SocketEventTypes["USER_JOIN"] = "USER_JOIN";
    SocketEventTypes["USER_LEAVE"] = "USER_LEAVE";
})(SocketEventTypes || (exports.SocketEventTypes = SocketEventTypes = {}));
/**
 * Enum para la dirección de los eventos WebSocket.
 */
var SocketEventDirection;
(function (SocketEventDirection) {
    SocketEventDirection["IN"] = "in";
    SocketEventDirection["OUT"] = "out";
    SocketEventDirection["BOTH"] = "both";
})(SocketEventDirection || (exports.SocketEventDirection = SocketEventDirection = {}));
