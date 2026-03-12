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
exports.SSEMetricsService = void 0;
var common_1 = require("@nestjs/common");
/**
 * Servicio de métricas y monitoreo para SSE
 *
 * Proporciona:
 * - Estadísticas de conexiones en tiempo real
 * - Métricas de rendimiento (throughput, latencia)
 * - Health checks
 * - Información del sistema
 */
var SSEMetricsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SSEMetricsService = _classThis = /** @class */ (function () {
        function SSEMetricsService_1(connectionManager, eventBridge) {
            this.connectionManager = connectionManager;
            this.eventBridge = eventBridge;
            this.logger = new common_1.Logger(SSEMetricsService.name);
            this.startTime = Date.now();
        }
        /**
         * Obtiene todas las métricas del sistema SSE
         */
        SSEMetricsService_1.prototype.getMetrics = function () {
            return {
                timestamp: new Date().toISOString(),
                uptime: this.getUptime(),
                connections: this.getConnectionMetrics(),
                events: this.getEventMetrics(),
                health: this.getHealthStatus(),
                system: this.getSystemMetrics(),
            };
        };
        /**
         * Métricas de conexiones
         */
        SSEMetricsService_1.prototype.getConnectionMetrics = function () {
            var _a, _b;
            var stats = this.connectionManager.getStats();
            var managerMetrics = this.connectionManager.getMetrics();
            return {
                active: stats.totalConnections,
                managers: stats.totalManagers,
                tenants: ((_a = stats.connectionsByTenant) === null || _a === void 0 ? void 0 : _a.length) || 0,
                byManager: stats.connectionsByManager.slice(0, 10), // Top 10
                byTenant: (_b = stats.connectionsByTenant) === null || _b === void 0 ? void 0 : _b.slice(0, 10), // Top 10
                throughput: {
                    eventsSent: managerMetrics.throughput.eventsSent,
                    bytesSent: managerMetrics.throughput.bytesSent,
                    eventsPerSecond: Math.round(managerMetrics.throughput.eventsPerSecond * 100) / 100,
                    bytesPerSecond: Math.round(managerMetrics.throughput.bytesPerSecond * 100) / 100,
                },
            };
        };
        /**
         * Métricas de eventos del Event Bridge
         */
        SSEMetricsService_1.prototype.getEventMetrics = function () {
            var bridgeMetrics = this.eventBridge.getMetrics();
            return {
                processed: bridgeMetrics.eventsProcessed,
                byType: bridgeMetrics.eventsByType,
                activeGroups: bridgeMetrics.activeGroups,
                totalGroups: bridgeMetrics.totalGroups,
            };
        };
        /**
         * Estado de salud del sistema SSE
         */
        SSEMetricsService_1.prototype.getHealthStatus = function () {
            var stats = this.connectionManager.getStats();
            var uptime = Date.now() - this.startTime;
            var memory = process.memoryUsage();
            // Determinar status general
            var status = 'idle';
            var issues = [];
            if (stats.totalConnections === 0) {
                status = 'idle';
            }
            else if (stats.totalConnections < 1000) {
                status = 'healthy';
            }
            else if (stats.totalConnections < 5000) {
                status = 'warning';
                issues.push('High connection count');
            }
            else {
                status = 'critical';
                issues.push('Very high connection count');
            }
            // Verificar uso de memoria
            var heapUsedMB = memory.heapUsed / 1024 / 1024;
            var heapTotalMB = memory.heapTotal / 1024 / 1024;
            var heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;
            if (heapUsagePercent > 90) {
                status = 'critical';
                issues.push('Critical memory usage');
            }
            else if (heapUsagePercent > 75) {
                if (status !== 'critical')
                    status = 'warning';
                issues.push('High memory usage');
            }
            return {
                status: status,
                issues: issues.length > 0 ? issues : undefined,
                checks: {
                    connections: stats.totalConnections > 0 ? 'pass' : 'idle',
                    memory: heapUsagePercent < 75 ? 'pass' : heapUsagePercent < 90 ? 'warn' : 'fail',
                    uptime: uptime > 60000 ? 'pass' : 'starting', // Al menos 1 minuto
                },
            };
        };
        /**
         * Métricas del sistema (Node.js)
         */
        SSEMetricsService_1.prototype.getSystemMetrics = function () {
            var memory = process.memoryUsage();
            var cpuUsage = process.cpuUsage();
            return {
                memory: {
                    heapUsed: this.formatBytes(memory.heapUsed),
                    heapTotal: this.formatBytes(memory.heapTotal),
                    heapUsedPercent: Math.round((memory.heapUsed / memory.heapTotal) * 100),
                    external: this.formatBytes(memory.external),
                    rss: this.formatBytes(memory.rss),
                },
                cpu: {
                    user: Math.round(cpuUsage.user / 1000), // microsegundos -> ms
                    system: Math.round(cpuUsage.system / 1000),
                },
                process: {
                    pid: process.pid,
                    nodeVersion: process.version,
                    platform: process.platform,
                    arch: process.arch,
                },
            };
        };
        /**
         * Obtiene uptime del servicio SSE
         */
        SSEMetricsService_1.prototype.getUptime = function () {
            var uptimeMs = Date.now() - this.startTime;
            var uptimeSeconds = Math.floor(uptimeMs / 1000);
            return {
                milliseconds: uptimeMs,
                seconds: uptimeSeconds,
                formatted: this.formatUptime(uptimeMs),
            };
        };
        /**
         * Health check simple (para endpoints /health)
         */
        SSEMetricsService_1.prototype.healthCheck = function () {
            var health = this.getHealthStatus();
            return {
                status: health.status === 'healthy' || health.status === 'idle' ? 'ok' : 'degraded',
                timestamp: new Date().toISOString(),
                details: health,
            };
        };
        /**
         * Readiness check (para Kubernetes/Docker)
         */
        SSEMetricsService_1.prototype.readinessCheck = function () {
            var health = this.getHealthStatus();
            var isReady = health.status !== 'critical';
            return {
                ready: isReady,
                timestamp: new Date().toISOString(),
                checks: health.checks,
            };
        };
        /**
         * Liveness check (para Kubernetes/Docker)
         */
        SSEMetricsService_1.prototype.livenessCheck = function () {
            var uptime = Date.now() - this.startTime;
            return {
                alive: true,
                uptime: uptime,
                timestamp: new Date().toISOString(),
            };
        };
        /**
         * Estadísticas detalladas para dashboard
         */
        SSEMetricsService_1.prototype.getDashboardStats = function () {
            var metrics = this.getMetrics();
            return __assign(__assign({}, metrics), { summary: {
                    activeConnections: metrics.connections.active,
                    activeManagers: metrics.connections.managers,
                    eventsPerSecond: metrics.connections.throughput.eventsPerSecond,
                    healthStatus: metrics.health.status,
                    uptime: metrics.uptime.formatted,
                }, recommendations: this.getRecommendations(metrics) });
        };
        /**
         * Genera recomendaciones basadas en métricas
         */
        SSEMetricsService_1.prototype.getRecommendations = function (metrics) {
            var recommendations = [];
            // Alto número de conexiones
            if (metrics.connections.active > 5000) {
                recommendations.push('Consider horizontal scaling (add more server instances)');
            }
            // Alto uso de memoria
            if (metrics.system.memory.heapUsedPercent > 75) {
                recommendations.push('Memory usage is high. Consider increasing Node.js heap size or optimizing memory usage');
            }
            // Baja tasa de eventos
            if (metrics.connections.active > 100 && metrics.connections.throughput.eventsPerSecond < 1) {
                recommendations.push('Low event throughput detected. Check if event bridge is properly configured');
            }
            // Muchos grupos de eventos inactivos
            var inactiveGroups = metrics.events.totalGroups - metrics.events.activeGroups.length;
            if (inactiveGroups > 0) {
                recommendations.push("".concat(inactiveGroups, " event listener group(s) are disabled. Consider enabling or removing them"));
            }
            return recommendations;
        };
        // ═══════════════════════════════════════════════════════════════
        // HELPERS
        // ═══════════════════════════════════════════════════════════════
        /**
         * Formatea bytes a string legible
         */
        SSEMetricsService_1.prototype.formatBytes = function (bytes) {
            var mb = bytes / 1024 / 1024;
            if (mb < 1)
                return "".concat((bytes / 1024).toFixed(2), " KB");
            if (mb < 1024)
                return "".concat(mb.toFixed(2), " MB");
            return "".concat((mb / 1024).toFixed(2), " GB");
        };
        /**
         * Formatea uptime a string legible
         */
        SSEMetricsService_1.prototype.formatUptime = function (ms) {
            var seconds = Math.floor(ms / 1000);
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var days = Math.floor(hours / 24);
            if (days > 0)
                return "".concat(days, "d ").concat(hours % 24, "h ").concat(minutes % 60, "m");
            if (hours > 0)
                return "".concat(hours, "h ").concat(minutes % 60, "m ").concat(seconds % 60, "s");
            if (minutes > 0)
                return "".concat(minutes, "m ").concat(seconds % 60, "s");
            return "".concat(seconds, "s");
        };
        /**
         * Exporta métricas en formato Prometheus
         * Útil para integración con sistemas de monitoreo
         */
        SSEMetricsService_1.prototype.exportPrometheusMetrics = function () {
            var metrics = this.getMetrics();
            var lines = [];
            // Conexiones
            lines.push("# HELP sse_connections_active Number of active SSE connections");
            lines.push("# TYPE sse_connections_active gauge");
            lines.push("sse_connections_active ".concat(metrics.connections.active));
            lines.push("# HELP sse_managers_active Number of managers with active connections");
            lines.push("# TYPE sse_managers_active gauge");
            lines.push("sse_managers_active ".concat(metrics.connections.managers));
            // Eventos
            lines.push("# HELP sse_events_processed_total Total events processed");
            lines.push("# TYPE sse_events_processed_total counter");
            lines.push("sse_events_processed_total ".concat(metrics.events.processed));
            lines.push("# HELP sse_events_per_second Events per second");
            lines.push("# TYPE sse_events_per_second gauge");
            lines.push("sse_events_per_second ".concat(metrics.connections.throughput.eventsPerSecond));
            // Memoria
            lines.push("# HELP sse_memory_heap_used_bytes Heap memory used");
            lines.push("# TYPE sse_memory_heap_used_bytes gauge");
            lines.push("sse_memory_heap_used_bytes ".concat(process.memoryUsage().heapUsed));
            return lines.join('\n');
        };
        return SSEMetricsService_1;
    }());
    __setFunctionName(_classThis, "SSEMetricsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SSEMetricsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SSEMetricsService = _classThis;
}();
exports.SSEMetricsService = SSEMetricsService;
