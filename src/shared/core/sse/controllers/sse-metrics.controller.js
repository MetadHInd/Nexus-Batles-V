"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEMetricsController = void 0;
var common_1 = require("@nestjs/common");
/**
 * Controller de métricas y monitoreo SSE
 *
 * Endpoints:
 * - GET /sse/metrics - Métricas completas del sistema
 * - GET /sse/health - Health check
 * - GET /sse/health/ready - Readiness probe (Kubernetes)
 * - GET /sse/health/live - Liveness probe (Kubernetes)
 * - GET /sse/stats - Estadísticas para dashboard
 * - GET /sse/connections - Lista de conexiones activas
 * - GET /sse/events - Estado del Event Bridge
 */
var SSEMetricsController = function () {
    var _classDecorators = [(0, common_1.Controller)('sse')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getMetrics_decorators;
    var _healthCheck_decorators;
    var _readinessCheck_decorators;
    var _livenessCheck_decorators;
    var _getDashboardStats_decorators;
    var _getConnections_decorators;
    var _getEventBridgeInfo_decorators;
    var _getRateLimitStats_decorators;
    var _getPrometheusMetrics_decorators;
    var SSEMetricsController = _classThis = /** @class */ (function () {
        function SSEMetricsController_1(metricsService, connectionManager, eventBridge, rateLimitGuard) {
            this.metricsService = (__runInitializers(this, _instanceExtraInitializers), metricsService);
            this.connectionManager = connectionManager;
            this.eventBridge = eventBridge;
            this.rateLimitGuard = rateLimitGuard;
        }
        /**
         * GET /sse/metrics
         * Obtiene todas las métricas del sistema SSE
         */
        SSEMetricsController_1.prototype.getMetrics = function () {
            return this.metricsService.getMetrics();
        };
        /**
         * GET /sse/health
         * Health check general
         */
        SSEMetricsController_1.prototype.healthCheck = function () {
            return this.metricsService.healthCheck();
        };
        /**
         * GET /sse/health/ready
         * Readiness probe para Kubernetes
         */
        SSEMetricsController_1.prototype.readinessCheck = function () {
            return this.metricsService.readinessCheck();
        };
        /**
         * GET /sse/health/live
         * Liveness probe para Kubernetes
         */
        SSEMetricsController_1.prototype.livenessCheck = function () {
            return this.metricsService.livenessCheck();
        };
        /**
         * GET /sse/stats
         * Estadísticas detalladas para dashboard
         */
        SSEMetricsController_1.prototype.getDashboardStats = function () {
            return this.metricsService.getDashboardStats();
        };
        /**
         * GET /sse/connections
         * Lista de conexiones activas
         */
        SSEMetricsController_1.prototype.getConnections = function () {
            var _a;
            var stats = this.connectionManager.getStats();
            var allConnections = this.connectionManager.getAllConnections();
            return {
                summary: {
                    total: stats.totalConnections,
                    managers: stats.totalManagers,
                    tenants: ((_a = stats.connectionsByTenant) === null || _a === void 0 ? void 0 : _a.length) || 0,
                },
                connections: allConnections.map(function (client) { return ({
                    id: client.id,
                    managerId: client.managerId,
                    tenantId: client.tenantId,
                    connectedAt: client.connectedAt,
                    lastHeartbeat: client.lastHeartbeat,
                    metadata: client.metadata,
                }); }),
                byManager: stats.connectionsByManager,
                byTenant: stats.connectionsByTenant,
            };
        };
        /**
         * GET /sse/events
         * Estado del Event Bridge
         */
        SSEMetricsController_1.prototype.getEventBridgeInfo = function () {
            var _this = this;
            var metrics = this.eventBridge.getMetrics();
            var groups = this.eventBridge.listGroups();
            return {
                metrics: metrics,
                groups: groups.map(function (groupName) { return ({
                    name: groupName,
                    info: _this.eventBridge.getGroupInfo(groupName),
                }); }),
                config: this.eventBridge.getConfig(),
            };
        };
        /**
         * GET /sse/rate-limit
         * Estadísticas de rate limiting
         */
        SSEMetricsController_1.prototype.getRateLimitStats = function () {
            return this.rateLimitGuard.getStats();
        };
        /**
         * GET /sse/metrics/prometheus
         * Métricas en formato Prometheus
         */
        SSEMetricsController_1.prototype.getPrometheusMetrics = function () {
            return this.metricsService.exportPrometheusMetrics();
        };
        return SSEMetricsController_1;
    }());
    __setFunctionName(_classThis, "SSEMetricsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getMetrics_decorators = [(0, common_1.Get)('metrics')];
        _healthCheck_decorators = [(0, common_1.Get)('health')];
        _readinessCheck_decorators = [(0, common_1.Get)('health/ready')];
        _livenessCheck_decorators = [(0, common_1.Get)('health/live')];
        _getDashboardStats_decorators = [(0, common_1.Get)('stats')];
        _getConnections_decorators = [(0, common_1.Get)('connections')];
        _getEventBridgeInfo_decorators = [(0, common_1.Get)('events')];
        _getRateLimitStats_decorators = [(0, common_1.Get)('rate-limit')];
        _getPrometheusMetrics_decorators = [(0, common_1.Get)('metrics/prometheus')];
        __esDecorate(_classThis, null, _getMetrics_decorators, { kind: "method", name: "getMetrics", static: false, private: false, access: { has: function (obj) { return "getMetrics" in obj; }, get: function (obj) { return obj.getMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _healthCheck_decorators, { kind: "method", name: "healthCheck", static: false, private: false, access: { has: function (obj) { return "healthCheck" in obj; }, get: function (obj) { return obj.healthCheck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _readinessCheck_decorators, { kind: "method", name: "readinessCheck", static: false, private: false, access: { has: function (obj) { return "readinessCheck" in obj; }, get: function (obj) { return obj.readinessCheck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _livenessCheck_decorators, { kind: "method", name: "livenessCheck", static: false, private: false, access: { has: function (obj) { return "livenessCheck" in obj; }, get: function (obj) { return obj.livenessCheck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardStats_decorators, { kind: "method", name: "getDashboardStats", static: false, private: false, access: { has: function (obj) { return "getDashboardStats" in obj; }, get: function (obj) { return obj.getDashboardStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getConnections_decorators, { kind: "method", name: "getConnections", static: false, private: false, access: { has: function (obj) { return "getConnections" in obj; }, get: function (obj) { return obj.getConnections; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEventBridgeInfo_decorators, { kind: "method", name: "getEventBridgeInfo", static: false, private: false, access: { has: function (obj) { return "getEventBridgeInfo" in obj; }, get: function (obj) { return obj.getEventBridgeInfo; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRateLimitStats_decorators, { kind: "method", name: "getRateLimitStats", static: false, private: false, access: { has: function (obj) { return "getRateLimitStats" in obj; }, get: function (obj) { return obj.getRateLimitStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPrometheusMetrics_decorators, { kind: "method", name: "getPrometheusMetrics", static: false, private: false, access: { has: function (obj) { return "getPrometheusMetrics" in obj; }, get: function (obj) { return obj.getPrometheusMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SSEMetricsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SSEMetricsController = _classThis;
}();
exports.SSEMetricsController = SSEMetricsController;
