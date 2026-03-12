"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEMetricsController = void 0;
const common_1 = require("@nestjs/common");
const sse_metrics_service_1 = require("../services/sse-metrics.service");
const sse_connection_manager_service_1 = require("../services/sse-connection-manager.service");
const sse_event_bridge_service_1 = require("../services/sse-event-bridge.service");
const sse_rate_limit_guard_1 = require("../guards/sse-rate-limit.guard");
let SSEMetricsController = class SSEMetricsController {
    metricsService;
    connectionManager;
    eventBridge;
    rateLimitGuard;
    constructor(metricsService, connectionManager, eventBridge, rateLimitGuard) {
        this.metricsService = metricsService;
        this.connectionManager = connectionManager;
        this.eventBridge = eventBridge;
        this.rateLimitGuard = rateLimitGuard;
    }
    getMetrics() {
        return this.metricsService.getMetrics();
    }
    healthCheck() {
        return this.metricsService.healthCheck();
    }
    readinessCheck() {
        return this.metricsService.readinessCheck();
    }
    livenessCheck() {
        return this.metricsService.livenessCheck();
    }
    getDashboardStats() {
        return this.metricsService.getDashboardStats();
    }
    getConnections() {
        const stats = this.connectionManager.getStats();
        const allConnections = this.connectionManager.getAllConnections();
        return {
            summary: {
                total: stats.totalConnections,
                managers: stats.totalManagers,
                tenants: stats.connectionsByTenant?.length || 0,
            },
            connections: allConnections.map((client) => ({
                id: client.id,
                managerId: client.managerId,
                tenantId: client.tenantId,
                connectedAt: client.connectedAt,
                lastHeartbeat: client.lastHeartbeat,
                metadata: client.metadata,
            })),
            byManager: stats.connectionsByManager,
            byTenant: stats.connectionsByTenant,
        };
    }
    getEventBridgeInfo() {
        const metrics = this.eventBridge.getMetrics();
        const groups = this.eventBridge.listGroups();
        return {
            metrics,
            groups: groups.map((groupName) => ({
                name: groupName,
                info: this.eventBridge.getGroupInfo(groupName),
            })),
            config: this.eventBridge.getConfig(),
        };
    }
    getRateLimitStats() {
        return this.rateLimitGuard.getStats();
    }
    getPrometheusMetrics() {
        return this.metricsService.exportPrometheusMetrics();
    }
};
exports.SSEMetricsController = SSEMetricsController;
__decorate([
    (0, common_1.Get)('metrics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('health/ready'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "readinessCheck", null);
__decorate([
    (0, common_1.Get)('health/live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "livenessCheck", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('connections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "getConnections", null);
__decorate([
    (0, common_1.Get)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "getEventBridgeInfo", null);
__decorate([
    (0, common_1.Get)('rate-limit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "getRateLimitStats", null);
__decorate([
    (0, common_1.Get)('metrics/prometheus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SSEMetricsController.prototype, "getPrometheusMetrics", null);
exports.SSEMetricsController = SSEMetricsController = __decorate([
    (0, common_1.Controller)('sse'),
    __metadata("design:paramtypes", [sse_metrics_service_1.SSEMetricsService,
        sse_connection_manager_service_1.SSEConnectionManagerService,
        sse_event_bridge_service_1.SSEEventBridgeService,
        sse_rate_limit_guard_1.SSERateLimitGuard])
], SSEMetricsController);
//# sourceMappingURL=sse-metrics.controller.js.map