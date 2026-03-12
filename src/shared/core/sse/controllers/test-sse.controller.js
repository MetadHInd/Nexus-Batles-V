"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSSEController = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var base_sse_controller_1 = require("./base-sse.controller");
/**
 * ⚠️ CONTROLLER DE PRUEBA - NO USAR EN PRODUCCIÓN
 *
 * Este controller permite testear el sistema SSE sin necesidad de
 * autenticación real. Útil para desarrollo y debugging.
 *
 * Endpoints:
 * - GET  /sse/test/stream - Conexión SSE de prueba (sin auth)
 * - POST /sse/test/send-event - Enviar evento a un manager específico
 * - POST /sse/test/force-disconnect - Forzar desconexión de un manager
 * - GET  /sse/test/sessions/:managerId - Ver sesiones activas de un manager
 */
var TestSSEController = function () {
    var _classDecorators = [(0, common_1.Controller)('sse/test')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_sse_controller_1.BaseSSEController;
    var _instanceExtraInitializers = [];
    var _streamMinimal_decorators;
    var _streamTestEvents_decorators;
    var _sendTestEvent_decorators;
    var _forceDisconnect_decorators;
    var _getManagerSessions_decorators;
    var _toggleSingleSessionMode_decorators;
    var _getStatus_decorators;
    var _broadcast_decorators;
    var TestSSEController = _classThis = /** @class */ (function (_super) {
        __extends(TestSSEController_1, _super);
        function TestSSEController_1(connectionManager, rateLimitGuard) {
            var _this = _super.call(this, connectionManager) || this;
            _this.rateLimitGuard = (__runInitializers(_this, _instanceExtraInitializers), rateLimitGuard);
            _this.logger = new common_1.Logger(TestSSEController.name);
            return _this;
        }
        /**
         * Endpoint SSE de prueba MÍNIMO (sin BaseSSEController)
         * GET /sse/test/minimal
         */
        TestSSEController_1.prototype.streamMinimal = function (req) {
            var _this = this;
            this.logger.log("\uD83D\uDD2C MINIMAL SSE Test - Creating basic interval stream");
            return (0, rxjs_1.interval)(5000).pipe((0, operators_1.map)(function (index) {
                _this.logger.debug("\uD83D\uDCE1 Minimal emit: ".concat(index));
                return {
                    data: {
                        index: index,
                        timestamp: new Date().toISOString()
                    }
                };
            }));
        };
        /**
         * Endpoint SSE de prueba (SIN autenticación, SIN rate limiting)
         * GET /sse/test/stream?managerId=test_123&tenantId=tenant_001
         *
         * IMPORTANTE: Este endpoint NO usa autenticación NI rate limiting.
         * Solo para desarrollo/testing.
         */
        // @UseGuards(SSERateLimitGuard) // Temporalmente deshabilitado
        TestSSEController_1.prototype.streamTestEvents = function (req) {
            // Extraer parámetros de query (ya que no usamos decoradores con guards)
            var managerId = req.query.managerId || 'test_user';
            var tenantId = req.query.tenantId || 'test_tenant';
            this.logger.log("\uD83E\uDDEA TEST SSE Connection: manager=".concat(managerId, ", tenant=").concat(tenantId));
            // Obtener IP del cliente para el cleanup del rate limit
            var ip = this.getClientIp(req);
            this.logger.log("\uD83D\uDD0D Client IP: ".concat(ip));
            this.logger.log("\uD83C\uDFAC About to call createSSEStream...");
            try {
                // Usar el método base para crear el stream (SIN rate limit)
                var stream = this.createSSEStream(req, managerId, tenantId, {
                    metadata: {
                        isTest: true,
                        userAgent: req.headers['user-agent'],
                        ip: req.ip,
                    },
                }, undefined, // Sin IP tracking
                undefined);
                this.logger.log("\u2705 createSSEStream returned Observable");
                return stream;
            }
            catch (error) {
                this.logger.error("\uD83D\uDCA5 ERROR in createSSEStream:", error);
                throw error;
            }
        };
        /**
         * Extrae la IP del cliente
         */
        TestSSEController_1.prototype.getClientIp = function (req) {
            var forwarded = req.headers['x-forwarded-for'];
            if (forwarded && typeof forwarded === 'string') {
                return forwarded.split(',')[0].trim();
            }
            var realIp = req.headers['x-real-ip'];
            if (realIp && typeof realIp === 'string') {
                return realIp;
            }
            return req.ip || req.socket.remoteAddress || 'unknown';
        };
        /**
         * Enviar un evento de prueba a un manager específico
         * POST /sse/test/send-event
         *
         * Body: {
         *   managerId: string;
         *   eventType: string;
         *   payload: any;
         * }
         */
        TestSSEController_1.prototype.sendTestEvent = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var managerId, eventType, payload, result;
                return __generator(this, function (_a) {
                    managerId = body.managerId, eventType = body.eventType, payload = body.payload;
                    this.logger.log("\uD83D\uDCE4 Sending test event \"".concat(eventType, "\" to manager ").concat(managerId));
                    result = this.connectionManager.sendToManager(managerId, eventType, payload);
                    return [2 /*return*/, {
                            success: result.successCount > 0,
                            sent: result.successCount,
                            message: result.successCount > 0
                                ? "Event sent to ".concat(result.successCount, " connection(s)")
                                : "No active connections for manager ".concat(managerId),
                        }];
                });
            });
        };
        /**
         * Forzar desconexión de todas las sesiones de un manager
         * POST /sse/test/force-disconnect
         *
         * Body: {
         *   managerId: string;
         *   reason?: string;
         * }
         */
        TestSSEController_1.prototype.forceDisconnect = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var managerId, _a, reason, disconnected;
                return __generator(this, function (_b) {
                    managerId = body.managerId, _a = body.reason, reason = _a === void 0 ? 'Forced disconnection via test API' : _a;
                    this.logger.warn("\uD83D\uDD34 Force disconnecting manager ".concat(managerId, ". Reason: ").concat(reason));
                    disconnected = this.connectionManager.disconnectManager(managerId, reason);
                    return [2 /*return*/, {
                            success: true,
                            disconnected: disconnected,
                            message: "Disconnected ".concat(disconnected, " session(s) for manager ").concat(managerId),
                        }];
                });
            });
        };
        /**
         * Ver sesiones activas de un manager
         * GET /sse/test/sessions/:managerId
         */
        TestSSEController_1.prototype.getManagerSessions = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var managerId, sessions;
                return __generator(this, function (_a) {
                    managerId = req.params.managerId;
                    sessions = this.connectionManager.getManagerSessionsInfo(managerId);
                    return [2 /*return*/, {
                            managerId: managerId,
                            sessionsCount: sessions.length,
                            sessions: sessions,
                        }];
                });
            });
        };
        /**
         * Toggle del modo sesión única
         * POST /sse/test/single-session-mode
         *
         * Body: { enabled: boolean }
         */
        TestSSEController_1.prototype.toggleSingleSessionMode = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var enabled, currentState;
                return __generator(this, function (_a) {
                    enabled = body.enabled;
                    this.connectionManager.setSingleSessionMode(enabled);
                    currentState = this.connectionManager.isSingleSessionMode();
                    this.logger.log("\uD83C\uDFAE Single Session Mode ".concat(enabled ? 'ENABLED' : 'DISABLED'));
                    return [2 /*return*/, {
                            success: true,
                            singleSessionMode: currentState,
                            message: "Single session mode is now ".concat(currentState ? 'ENABLED' : 'DISABLED'),
                        }];
                });
            });
        };
        /**
         * Obtener estado del sistema SSE
         * GET /sse/test/status
         */
        TestSSEController_1.prototype.getStatus = function () {
            return __awaiter(this, void 0, void 0, function () {
                var metrics, singleSessionMode;
                return __generator(this, function (_a) {
                    metrics = this.connectionManager.getMetrics();
                    singleSessionMode = this.connectionManager.isSingleSessionMode();
                    return [2 /*return*/, {
                            singleSessionMode: singleSessionMode,
                            metrics: metrics,
                            timestamp: new Date().toISOString(),
                        }];
                });
            });
        };
        /**
         * Broadcast de evento a TODOS los clientes conectados
         * POST /sse/test/broadcast
         *
         * Body: {
         *   eventType: string;
         *   payload: any;
         * }
         */
        TestSSEController_1.prototype.broadcast = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var eventType, payload, result;
                return __generator(this, function (_a) {
                    eventType = body.eventType, payload = body.payload;
                    this.logger.log("\uD83D\uDCE1 Broadcasting event \"".concat(eventType, "\" to all clients"));
                    result = this.connectionManager.broadcast(eventType, payload);
                    return [2 /*return*/, {
                            success: result.successCount > 0,
                            sent: result.successCount,
                            message: "Event broadcasted to ".concat(result.successCount, " connection(s)"),
                        }];
                });
            });
        };
        return TestSSEController_1;
    }(_classSuper));
    __setFunctionName(_classThis, "TestSSEController");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _streamMinimal_decorators = [(0, common_1.Sse)('minimal')];
        _streamTestEvents_decorators = [(0, common_1.Sse)('stream')];
        _sendTestEvent_decorators = [(0, common_1.Post)('send-event'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _forceDisconnect_decorators = [(0, common_1.Post)('force-disconnect'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _getManagerSessions_decorators = [(0, common_1.Get)('sessions/:managerId')];
        _toggleSingleSessionMode_decorators = [(0, common_1.Post)('single-session-mode'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _getStatus_decorators = [(0, common_1.Get)('status')];
        _broadcast_decorators = [(0, common_1.Post)('broadcast'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        __esDecorate(_classThis, null, _streamMinimal_decorators, { kind: "method", name: "streamMinimal", static: false, private: false, access: { has: function (obj) { return "streamMinimal" in obj; }, get: function (obj) { return obj.streamMinimal; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamTestEvents_decorators, { kind: "method", name: "streamTestEvents", static: false, private: false, access: { has: function (obj) { return "streamTestEvents" in obj; }, get: function (obj) { return obj.streamTestEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendTestEvent_decorators, { kind: "method", name: "sendTestEvent", static: false, private: false, access: { has: function (obj) { return "sendTestEvent" in obj; }, get: function (obj) { return obj.sendTestEvent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forceDisconnect_decorators, { kind: "method", name: "forceDisconnect", static: false, private: false, access: { has: function (obj) { return "forceDisconnect" in obj; }, get: function (obj) { return obj.forceDisconnect; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getManagerSessions_decorators, { kind: "method", name: "getManagerSessions", static: false, private: false, access: { has: function (obj) { return "getManagerSessions" in obj; }, get: function (obj) { return obj.getManagerSessions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _toggleSingleSessionMode_decorators, { kind: "method", name: "toggleSingleSessionMode", static: false, private: false, access: { has: function (obj) { return "toggleSingleSessionMode" in obj; }, get: function (obj) { return obj.toggleSingleSessionMode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatus_decorators, { kind: "method", name: "getStatus", static: false, private: false, access: { has: function (obj) { return "getStatus" in obj; }, get: function (obj) { return obj.getStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _broadcast_decorators, { kind: "method", name: "broadcast", static: false, private: false, access: { has: function (obj) { return "broadcast" in obj; }, get: function (obj) { return obj.broadcast; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TestSSEController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TestSSEController = _classThis;
}();
exports.TestSSEController = TestSSEController;
