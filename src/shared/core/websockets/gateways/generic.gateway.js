"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericGateway = void 0;
/**
 * Gateway WebSocket genérico y extensible.
 * Puedes extender esta clase para crear gateways específicos.
 */
/**
 * Clase base genérica para gateways WebSocket.
 * No debe tener decoradores de NestJS ni propiedades de servidor.
 * Extiende esta clase en tus gateways concretos y aplica los decoradores allí.
 */
/**
 * Clase base genérica y polimórfica para gateways WebSocket.
 * Extiende esta clase para gateways concretos y especializa los tipos según el sistema de sockets y eventos.
 */
var GenericGateway = /** @class */ (function () {
    function GenericGateway() {
        this.handlers = {};
    }
    GenericGateway.prototype.connect = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        // Implementación opcional en subclases
    };
    GenericGateway.prototype.disconnect = function () {
        // Implementación opcional en subclases
    };
    GenericGateway.prototype.setServer = function (server) {
        this.server = server;
    };
    GenericGateway.prototype.on = function (event, handler) {
        this.handlers[event] = handler;
    };
    GenericGateway.prototype.emit = function (event, payload) {
        if (!this.server)
            throw new Error('Server instance not set');
        this.server.emit(String(event), payload);
    };
    /**
     * Handler genérico para todos los eventos registrados.
     * Debe ser llamado por el método decorado en el gateway concreto.
     */
    GenericGateway.prototype.handleEvent = function (type, payload, client) {
        return __awaiter(this, void 0, void 0, function () {
            var handler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handler = this.handlers[type];
                        if (!handler) return [3 /*break*/, 2];
                        return [4 /*yield*/, handler(payload, client)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return GenericGateway;
}());
exports.GenericGateway = GenericGateway;
