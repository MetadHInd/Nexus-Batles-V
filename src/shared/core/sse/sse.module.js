"use strict";
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
exports.SSEModule = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var sse_connection_manager_service_1 = require("./services/sse-connection-manager.service");
var sse_event_bridge_service_1 = require("./services/sse-event-bridge.service");
var sse_metrics_service_1 = require("./services/sse-metrics.service");
var sse_auth_guard_1 = require("./guards/sse-auth.guard");
var sse_rate_limit_guard_1 = require("./guards/sse-rate-limit.guard");
var sse_metrics_controller_1 = require("./controllers/sse-metrics.controller");
var test_sse_controller_1 = require("./controllers/test-sse.controller");
var auth_sse_controller_1 = require("./controllers/auth-sse.controller");
var event_bus_service_1 = require("../services/service-cache/event-bus.service");
/**
 * Módulo SSE (Server-Sent Events)
 *
 * Proporciona infraestructura completa para comunicación unidireccional
 * en tiempo real del servidor hacia el cliente.
 *
 * Características:
 * - Gestión de conexiones SSE
 * - Event Bridge para conectar EventBus con SSE
 * - Guards de seguridad (autenticación y rate limiting)
 * - Métricas y monitoreo
 * - Base extensible para implementar endpoints SSE específicos
 *
 * Uso:
 * 1. Importar este módulo en tu feature module
 * 2. Extender BaseSSEController para crear tus endpoints SSE
 * 3. Registrar listeners de eventos en SSEEventBridgeService
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [SSEModule],
 *   controllers: [MySSEController],
 * })
 * export class MyFeatureModule {}
 * ```
 */
var SSEModule = function () {
    var _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [
                // JWT para autenticación de endpoints SSE
                jwt_1.JwtModule.register({
                    secret: process.env.JWT_SECRET || 'your-secret-key',
                    signOptions: { expiresIn: '15m' }, // Tokens cortos para SSE
                }),
            ],
            providers: [
                // Core Services
                sse_connection_manager_service_1.SSEConnectionManagerService,
                sse_event_bridge_service_1.SSEEventBridgeService,
                sse_metrics_service_1.SSEMetricsService,
                // Guards
                sse_auth_guard_1.SSEAuthGuard,
                sse_rate_limit_guard_1.SSERateLimitGuard,
                // EventBus (singleton existente)
                {
                    provide: event_bus_service_1.EventBusService,
                    useFactory: function () { return event_bus_service_1.EventBusService.getInstance(); },
                },
            ],
            controllers: [
                sse_metrics_controller_1.SSEMetricsController, // Endpoint de métricas
                test_sse_controller_1.TestSSEController, // ⚠️ Controller de prueba (remover en producción)
                auth_sse_controller_1.AuthSSEController, // Controller autenticado para usuarios
            ],
            exports: [
                // Exportar para uso en otros módulos
                sse_connection_manager_service_1.SSEConnectionManagerService,
                sse_event_bridge_service_1.SSEEventBridgeService,
                sse_metrics_service_1.SSEMetricsService,
                sse_auth_guard_1.SSEAuthGuard,
                sse_rate_limit_guard_1.SSERateLimitGuard,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SSEModule = _classThis = /** @class */ (function () {
        function SSEModule_1() {
        }
        return SSEModule_1;
    }());
    __setFunctionName(_classThis, "SSEModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SSEModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SSEModule = _classThis;
}();
exports.SSEModule = SSEModule;
