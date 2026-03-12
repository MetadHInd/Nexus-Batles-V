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
exports.SSEEventBridgeService = void 0;
var common_1 = require("@nestjs/common");
/**
 * Event Bridge: Conecta el EventBus con el sistema SSE
 *
 * Este servicio es el puente entre el EventBus de la aplicación y SSE.
 * Escucha eventos del EventBus y los reenvía a los clientes SSE correspondientes.
 *
 * Arquitectura:
 * - EventBus emite evento → Bridge lo escucha → SSE envía a clientes
 *
 * Ventajas:
 * - Desacoplamiento total entre lógica de negocio y transporte
 * - Fácil agregar nuevos eventos sin cambiar código de negocio
 * - Sistema extensible mediante registros dinámicos
 */
var SSEEventBridgeService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SSEEventBridgeService = _classThis = /** @class */ (function () {
        function SSEEventBridgeService_1(eventBus, connectionManager) {
            this.eventBus = eventBus;
            this.connectionManager = connectionManager;
            this.logger = new common_1.Logger(SSEEventBridgeService.name);
            /** Registro de grupos de listeners */
            this.listenerRegistries = new Map();
            /** Configuración del bridge */
            this.config = {
                enableLogging: true,
                logLevel: 'info',
                enableMetrics: true,
                eventPrefixes: [],
                ignoredEvents: [],
                maxListenersPerEvent: 10,
            };
            /** Métricas de eventos procesados */
            this.eventsProcessed = 0;
            this.eventsByType = new Map();
        }
        // ═══════════════════════════════════════════════════════════════
        // LIFECYCLE
        // ═══════════════════════════════════════════════════════════════
        SSEEventBridgeService_1.prototype.onModuleInit = function () {
            this.logger.log('🌉 Initializing SSE Event Bridge...');
            this.logger.log('✅ SSE Event Bridge ready');
            this.logger.log("\uD83D\uDCCB Registered ".concat(this.listenerRegistries.size, " listener group(s)"));
        };
        SSEEventBridgeService_1.prototype.onModuleDestroy = function () {
            this.logger.log('🛑 Shutting down SSE Event Bridge...');
            this.unregisterAllListeners();
        };
        // ═══════════════════════════════════════════════════════════════
        // CONFIGURACIÓN
        // ═══════════════════════════════════════════════════════════════
        /**
         * Actualiza la configuración del bridge
         */
        SSEEventBridgeService_1.prototype.updateConfig = function (config) {
            this.config = __assign(__assign({}, this.config), config);
            this.logger.log('⚙️ Event Bridge configuration updated');
        };
        /**
         * Obtiene la configuración actual
         */
        SSEEventBridgeService_1.prototype.getConfig = function () {
            return __assign({}, this.config);
        };
        // ═══════════════════════════════════════════════════════════════
        // REGISTRO DE LISTENERS
        // ═══════════════════════════════════════════════════════════════
        /**
         * Registra un grupo de listeners de eventos
         *
         * @param groupName Nombre del grupo (ej: 'GALATEA', 'AIA', 'USERS')
         * @param listeners Array de listeners a registrar
         * @param enabled Si el grupo está activo (default: true)
         *
         * @example
         * ```typescript
         * bridge.registerEventListeners('GALATEA', [
         *   {
         *     eventName: 'GALATEA_PROGRESS',
         *     handler: (payload) => {
         *       connectionManager.sendToManager(
         *         payload.managerId,
         *         'GALATEA_PROGRESS',
         *         payload
         *       );
         *     }
         *   },
         *   {
         *     eventName: 'GALATEA_RESPONSE',
         *     handler: (payload) => { ... }
         *   }
         * ]);
         * ```
         */
        SSEEventBridgeService_1.prototype.registerEventListeners = function (groupName, listeners, enabled) {
            var _this = this;
            if (enabled === void 0) { enabled = true; }
            if (this.listenerRegistries.has(groupName)) {
                this.logger.warn("Group \"".concat(groupName, "\" already registered, replacing..."));
                this.unregisterGroup(groupName);
            }
            // Crear registro
            var registry = {
                groupName: groupName,
                listeners: listeners,
                enabled: enabled,
            };
            // Registrar listeners en el EventBus
            if (enabled) {
                listeners.forEach(function (listener) {
                    _this.registerListenerInternal(groupName, listener);
                });
            }
            // Guardar registro
            this.listenerRegistries.set(groupName, registry);
            this.logger.log("\u2705 Registered ".concat(listeners.length, " listener(s) for group \"").concat(groupName, "\""));
        };
        /**
         * Registra un listener individual (internal)
         */
        SSEEventBridgeService_1.prototype.registerListenerInternal = function (groupName, listener) {
            var _this = this;
            var eventName = listener.eventName, handler = listener.handler, options = listener.options;
            // Verificar si el evento debe ser ignorado
            if (this.config.ignoredEvents.includes(eventName)) {
                this.logger.debug("Ignoring event \"".concat(eventName, "\" (in ignored list)"));
                return;
            }
            // Crear wrapper del handler
            var wrappedHandler = function (payload) { return __awaiter(_this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // Validar payload si hay validador
                            if (options === null || options === void 0 ? void 0 : options.validator) {
                                if (!options.validator(payload)) {
                                    this.logger.warn("Invalid payload for event \"".concat(eventName, "\", skipping SSE send"));
                                    return [2 /*return*/];
                                }
                            }
                            // Ejecutar handler
                            return [4 /*yield*/, handler(payload)];
                        case 1:
                            // Ejecutar handler
                            _a.sent();
                            // Actualizar métricas
                            if (this.config.enableMetrics) {
                                this.eventsProcessed++;
                                this.eventsByType.set(eventName, (this.eventsByType.get(eventName) || 0) + 1);
                            }
                            // Logging
                            if (this.config.enableLogging && this.config.logLevel === 'debug') {
                                this.logger.debug("\uD83D\uDD04 Event \"".concat(eventName, "\" processed by group \"").concat(groupName, "\""));
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error("Error processing event \"".concat(eventName, "\" in group \"").concat(groupName, "\":"), error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            // Registrar en EventBus
            this.eventBus.on(eventName, wrappedHandler);
            this.logger.debug("\uD83D\uDCCC Listener registered: ".concat(groupName, ".").concat(eventName));
        };
        /**
         * Registra un listener individual directamente
         * Útil para listeners ad-hoc sin grupo
         */
        SSEEventBridgeService_1.prototype.registerListener = function (eventName, handler, options) {
            var listener = {
                eventName: eventName,
                handler: handler,
                options: options,
            };
            this.registerListenerInternal('_adhoc', listener);
        };
        // ═══════════════════════════════════════════════════════════════
        // GESTIÓN DE GRUPOS
        // ═══════════════════════════════════════════════════════════════
        /**
         * Habilita un grupo de listeners
         */
        SSEEventBridgeService_1.prototype.enableGroup = function (groupName) {
            var _this = this;
            var registry = this.listenerRegistries.get(groupName);
            if (!registry) {
                this.logger.warn("Group \"".concat(groupName, "\" not found"));
                return;
            }
            if (registry.enabled) {
                this.logger.debug("Group \"".concat(groupName, "\" already enabled"));
                return;
            }
            // Registrar listeners
            registry.listeners.forEach(function (listener) {
                _this.registerListenerInternal(groupName, listener);
            });
            registry.enabled = true;
            this.logger.log("\u2705 Group \"".concat(groupName, "\" enabled"));
        };
        /**
         * Deshabilita un grupo de listeners
         */
        SSEEventBridgeService_1.prototype.disableGroup = function (groupName) {
            var registry = this.listenerRegistries.get(groupName);
            if (!registry) {
                this.logger.warn("Group \"".concat(groupName, "\" not found"));
                return;
            }
            if (!registry.enabled) {
                this.logger.debug("Group \"".concat(groupName, "\" already disabled"));
                return;
            }
            registry.enabled = false;
            this.logger.log("\u23F8\uFE0F Group \"".concat(groupName, "\" disabled"));
        };
        /**
         * Desregistra un grupo completo
         */
        SSEEventBridgeService_1.prototype.unregisterGroup = function (groupName) {
            var _this = this;
            var registry = this.listenerRegistries.get(groupName);
            if (!registry) {
                this.logger.warn("Group \"".concat(groupName, "\" not found"));
                return;
            }
            // Desregistrar listeners
            registry.listeners.forEach(function (listener) {
                _this.eventBus.off(listener.eventName, listener.handler);
            });
            this.listenerRegistries.delete(groupName);
            this.logger.log("\uD83D\uDDD1\uFE0F Group \"".concat(groupName, "\" unregistered"));
        };
        /**
         * Desregistra todos los grupos
         */
        SSEEventBridgeService_1.prototype.unregisterAllListeners = function () {
            var _this = this;
            var groups = Array.from(this.listenerRegistries.keys());
            groups.forEach(function (group) { return _this.unregisterGroup(group); });
            this.logger.log("Unregistered ".concat(groups.length, " group(s)"));
        };
        // ═══════════════════════════════════════════════════════════════
        // HELPERS PARA ENVÍO
        // ═══════════════════════════════════════════════════════════════
        /**
         * Helper: Envía evento SSE basado en managerId del payload
         *
         * Útil para la mayoría de casos donde el payload incluye managerId
         */
        SSEEventBridgeService_1.prototype.sendToManagerFromPayload = function (eventName, payload) {
            if (!payload.managerId) {
                this.logger.warn("Payload missing managerId for event \"".concat(eventName, "\""));
                return;
            }
            this.connectionManager.sendToManager(payload.managerId, eventName, payload);
        };
        /**
         * Helper: Envía evento SSE basado en tenantId del payload
         */
        SSEEventBridgeService_1.prototype.sendToTenantFromPayload = function (eventName, payload) {
            if (!payload.tenantId) {
                this.logger.warn("Payload missing tenantId for event \"".concat(eventName, "\""));
                return;
            }
            this.connectionManager.sendToTenant(payload.tenantId, eventName, payload);
        };
        /**
         * Helper: Broadcast evento SSE a todos los clientes
         */
        SSEEventBridgeService_1.prototype.broadcastFromPayload = function (eventName, payload) {
            this.connectionManager.broadcast(eventName, payload);
        };
        // ═══════════════════════════════════════════════════════════════
        // CONSULTAS Y MÉTRICAS
        // ═══════════════════════════════════════════════════════════════
        /**
         * Lista todos los grupos registrados
         */
        SSEEventBridgeService_1.prototype.listGroups = function () {
            return Array.from(this.listenerRegistries.keys());
        };
        /**
         * Obtiene información de un grupo
         */
        SSEEventBridgeService_1.prototype.getGroupInfo = function (groupName) {
            return this.listenerRegistries.get(groupName);
        };
        /**
         * Obtiene métricas del bridge
         */
        SSEEventBridgeService_1.prototype.getMetrics = function () {
            return {
                eventsProcessed: this.eventsProcessed,
                eventsByType: Object.fromEntries(this.eventsByType),
                activeGroups: Array.from(this.listenerRegistries.values())
                    .filter(function (r) { return r.enabled; })
                    .map(function (r) { return ({
                    name: r.groupName,
                    listeners: r.listeners.length,
                }); }),
                totalGroups: this.listenerRegistries.size,
            };
        };
        /**
         * Resetea métricas
         */
        SSEEventBridgeService_1.prototype.resetMetrics = function () {
            this.eventsProcessed = 0;
            this.eventsByType.clear();
            this.logger.log('📊 Bridge metrics reset');
        };
        return SSEEventBridgeService_1;
    }());
    __setFunctionName(_classThis, "SSEEventBridgeService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SSEEventBridgeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SSEEventBridgeService = _classThis;
}();
exports.SSEEventBridgeService = SSEEventBridgeService;
