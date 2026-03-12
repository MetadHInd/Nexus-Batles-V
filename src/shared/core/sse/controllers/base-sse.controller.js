"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSSEController = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var uuid_1 = require("uuid");
/**
 * Controller base abstracto para SSE
 *
 * Proporciona la funcionalidad común para todos los endpoints SSE:
 * - Configuración de headers HTTP
 * - Registro de conexiones
 * - Cleanup automático
 * - Mensaje inicial de conexión
 *
 * Los controllers específicos deben extender esta clase e implementar
 * sus propios endpoints usando el método `createSSEStream`
 */
var BaseSSEController = function () {
    var _classDecorators = [(0, common_1.Controller)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BaseSSEController = _classThis = /** @class */ (function () {
        function BaseSSEController_1(connectionManager) {
            this.connectionManager = connectionManager;
            this.logger = new common_1.Logger(this.constructor.name);
        }
        /**
         * Crea un stream SSE para un cliente
         *
         * @param req Request de Express
         * @param managerId ID del manager/usuario
         * @param tenantId ID del tenant
         * @param metadata Metadata adicional del cliente
         * @param clientIp IP del cliente (opcional, para rate limit cleanup)
         * @param rateLimitGuard Guard de rate limiting (opcional, para cleanup)
         * @returns Observable que mantiene la conexión abierta
         */
        BaseSSEController_1.prototype.createSSEStream = function (req, managerId, tenantId, metadata, clientIp, rateLimitGuard) {
            var _this = this;
            this.logger.log("\uD83D\uDE80 ENTERED createSSEStream method");
            var clientId = (0, uuid_1.v4)();
            var response = req.res;
            this.logger.log("\uD83C\uDD94 Generated clientId: ".concat(clientId));
            // ════════════════════════════════════════════════════════════
            // DESHABILITAR TIMEOUTS ANTES DE CUALQUIER OTRA COSA
            // ════════════════════════════════════════════════════════════
            // IMPORTANTE: Esto debe hacerse ANTES de que NestJS envíe los headers
            req.setTimeout(0);
            response.setTimeout(0);
            if (req.socket) {
                req.socket.setTimeout(0);
                req.socket.setKeepAlive(true, 30000);
            }
            this.logger.debug("\u2699\uFE0F Timeouts disabled for ".concat(clientId));
            // ════════════════════════════════════════════════════════════
            // NOTA: Los headers SSE son configurados automáticamente por @Sse()
            // NO intentar configurarlos manualmente aquí
            // ════════════════════════════════════════════════════════════
            // ════════════════════════════════════════════════════════════
            // CREAR CLIENTE SSE
            // ════════════════════════════════════════════════════════════
            var client = {
                id: clientId,
                managerId: managerId,
                tenantId: tenantId,
                response: response,
                connectedAt: new Date(),
                lastHeartbeat: new Date(),
                lastEventId: req.headers['last-event-id'],
                metadata: __assign({ userAgent: req.headers['user-agent'], ip: req.ip || req.socket.remoteAddress, managedByObservable: true }, metadata),
            };
            // ════════════════════════════════════════════════════════════
            // REGISTRAR CONEXIÓN
            // ════════════════════════════════════════════════════════════
            this.logger.log("\uD83D\uDCDD Registering client ".concat(clientId, "..."));
            this.connectionManager.addConnection(client);
            this.logger.log("\u2705 Client ".concat(clientId, " registered successfully"));
            // ════════════════════════════════════════════════════════════
            // ENVIAR MENSAJE INICIAL
            // ════════════════════════════════════════════════════════════
            // NO enviar mensaje inicial aquí - causa conflicto con @Sse()
            // this.logger.log(`📤 Sending initial message to ${clientId}...`);
            // const sent = this.connectionManager.sendToClient(clientId, 'connected', {...});
            // ════════════════════════════════════════════════════════════
            // RETORNAR OBSERVABLE
            // ════════════════════════════════════════════════════════════
            this.logger.log("\uD83D\uDD04 Creating observable for client ".concat(clientId, "..."));
            // Función de cleanup (será llamada desde el Observable)
            var cleanup = function () {
                _this.logger.log("\uD83E\uDDF9 Cleaning up client ".concat(clientId, "..."));
                _this.connectionManager.removeConnection(clientId);
            };
            // ════════════════════════════════════════════════════════════
            // CREAR STREAM SSE QUE NUNCA SE COMPLETA
            // ════════════════════════════════════════════════════════════
            this.logger.debug("\uD83C\uDFAF Creating SSE stream for ".concat(clientId));
            var stream = (0, rxjs_1.interval)(5000).pipe((0, operators_1.startWith)(-1), // Emitir un valor inicial inmediatamente
            (0, operators_1.map)(function (tick) {
                _this.logger.debug("\u23F0 Tick ".concat(tick, " for ").concat(clientId));
                var eventType = tick === -1 ? 'connected' : 'heartbeat';
                var payload = {
                    tick: tick,
                    timestamp: new Date().toISOString(),
                    clientId: clientId,
                    message: tick === -1 ? 'Connected successfully' : 'Heartbeat'
                };
                // NestJS @Sse() espera un objeto con 'data' y opcionalmente 'type'
                // para enviar eventos con tipo específico en formato SSE
                return {
                    type: eventType,
                    data: payload
                };
            }));
            // ════════════════════════════════════════════════════════════
            // REGISTRAR CLEANUP LISTENERS
            // ════════════════════════════════════════════════════════════
            req.on('close', function () {
                _this.logger.log("\uD83D\uDD0C Connection closed for ".concat(clientId));
                if (clientIp && rateLimitGuard) {
                    rateLimitGuard.decrementConnection(clientIp);
                }
                cleanup();
            });
            req.on('error', function (error) {
                _this.logger.error("\u274C Connection error for ".concat(clientId, ":"), error);
                cleanup();
            });
            this.logger.debug("\u2705 Stream created for ".concat(clientId));
            return stream;
        };
        /**
         * Envía un evento de error a un cliente específico
         */
        BaseSSEController_1.prototype.sendError = function (clientId, error, code, details) {
            this.connectionManager.sendToClient(clientId, 'error', {
                error: error,
                code: code,
                details: details,
            });
        };
        /**
         * Verifica si un cliente está conectado
         */
        BaseSSEController_1.prototype.isClientConnected = function (clientId) {
            return this.connectionManager.isConnected(clientId);
        };
        /**
         * Obtiene información de un cliente
         */
        BaseSSEController_1.prototype.getClientInfo = function (clientId) {
            return this.connectionManager.getClient(clientId);
        };
        return BaseSSEController_1;
    }());
    __setFunctionName(_classThis, "BaseSSEController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BaseSSEController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BaseSSEController = _classThis;
}();
exports.BaseSSEController = BaseSSEController;
