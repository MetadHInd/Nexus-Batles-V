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
var SSEMetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSEMetricsService = void 0;
const common_1 = require("@nestjs/common");
const sse_connection_manager_service_1 = require("./sse-connection-manager.service");
const sse_event_bridge_service_1 = require("./sse-event-bridge.service");
let SSEMetricsService = SSEMetricsService_1 = class SSEMetricsService {
    connectionManager;
    eventBridge;
    logger = new common_1.Logger(SSEMetricsService_1.name);
    startTime = Date.now();
    constructor(connectionManager, eventBridge) {
        this.connectionManager = connectionManager;
        this.eventBridge = eventBridge;
    }
    getMetrics() {
        return {
            timestamp: new Date().toISOString(),
            uptime: this.getUptime(),
            connections: this.getConnectionMetrics(),
            events: this.getEventMetrics(),
            health: this.getHealthStatus(),
            system: this.getSystemMetrics(),
        };
    }
    getConnectionMetrics() {
        const stats = this.connectionManager.getStats();
        const managerMetrics = this.connectionManager.getMetrics();
        return {
            active: stats.totalConnections,
            managers: stats.totalManagers,
            tenants: stats.connectionsByTenant?.length || 0,
            byManager: stats.connectionsByManager.slice(0, 10),
            byTenant: stats.connectionsByTenant?.slice(0, 10),
            throughput: {
                eventsSent: managerMetrics.throughput.eventsSent,
                bytesSent: managerMetrics.throughput.bytesSent,
                eventsPerSecond: Math.round(managerMetrics.throughput.eventsPerSecond * 100) / 100,
                bytesPerSecond: Math.round(managerMetrics.throughput.bytesPerSecond * 100) / 100,
            },
        };
    }
    getEventMetrics() {
        const bridgeMetrics = this.eventBridge.getMetrics();
        return {
            processed: bridgeMetrics.eventsProcessed,
            byType: bridgeMetrics.eventsByType,
            activeGroups: bridgeMetrics.activeGroups,
            totalGroups: bridgeMetrics.totalGroups,
        };
    }
    getHealthStatus() {
        const stats = this.connectionManager.getStats();
        const uptime = Date.now() - this.startTime;
        const memory = process.memoryUsage();
        let status = 'idle';
        const issues = [];
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
        const heapUsedMB = memory.heapUsed / 1024 / 1024;
        const heapTotalMB = memory.heapTotal / 1024 / 1024;
        const heapUsagePercent = (heapUsedMB / heapTotalMB) * 100;
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
            status,
            issues: issues.length > 0 ? issues : undefined,
            checks: {
                connections: stats.totalConnections > 0 ? 'pass' : 'idle',
                memory: heapUsagePercent < 75 ? 'pass' : heapUsagePercent < 90 ? 'warn' : 'fail',
                uptime: uptime > 60000 ? 'pass' : 'starting',
            },
        };
    }
    getSystemMetrics() {
        const memory = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        return {
            memory: {
                heapUsed: this.formatBytes(memory.heapUsed),
                heapTotal: this.formatBytes(memory.heapTotal),
                heapUsedPercent: Math.round((memory.heapUsed / memory.heapTotal) * 100),
                external: this.formatBytes(memory.external),
                rss: this.formatBytes(memory.rss),
            },
            cpu: {
                user: Math.round(cpuUsage.user / 1000),
                system: Math.round(cpuUsage.system / 1000),
            },
            process: {
                pid: process.pid,
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch,
            },
        };
    }
    getUptime() {
        const uptimeMs = Date.now() - this.startTime;
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        return {
            milliseconds: uptimeMs,
            seconds: uptimeSeconds,
            formatted: this.formatUptime(uptimeMs),
        };
    }
    healthCheck() {
        const health = this.getHealthStatus();
        return {
            status: health.status === 'healthy' || health.status === 'idle' ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            details: health,
        };
    }
    readinessCheck() {
        const health = this.getHealthStatus();
        const isReady = health.status !== 'critical';
        return {
            ready: isReady,
            timestamp: new Date().toISOString(),
            checks: health.checks,
        };
    }
    livenessCheck() {
        const uptime = Date.now() - this.startTime;
        return {
            alive: true,
            uptime: uptime,
            timestamp: new Date().toISOString(),
        };
    }
    getDashboardStats() {
        const metrics = this.getMetrics();
        return {
            ...metrics,
            summary: {
                activeConnections: metrics.connections.active,
                activeManagers: metrics.connections.managers,
                eventsPerSecond: metrics.connections.throughput.eventsPerSecond,
                healthStatus: metrics.health.status,
                uptime: metrics.uptime.formatted,
            },
            recommendations: this.getRecommendations(metrics),
        };
    }
    getRecommendations(metrics) {
        const recommendations = [];
        if (metrics.connections.active > 5000) {
            recommendations.push('Consider horizontal scaling (add more server instances)');
        }
        if (metrics.system.memory.heapUsedPercent > 75) {
            recommendations.push('Memory usage is high. Consider increasing Node.js heap size or optimizing memory usage');
        }
        if (metrics.connections.active > 100 && metrics.connections.throughput.eventsPerSecond < 1) {
            recommendations.push('Low event throughput detected. Check if event bridge is properly configured');
        }
        const inactiveGroups = metrics.events.totalGroups - metrics.events.activeGroups.length;
        if (inactiveGroups > 0) {
            recommendations.push(`${inactiveGroups} event listener group(s) are disabled. Consider enabling or removing them`);
        }
        return recommendations;
    }
    formatBytes(bytes) {
        const mb = bytes / 1024 / 1024;
        if (mb < 1)
            return `${(bytes / 1024).toFixed(2)} KB`;
        if (mb < 1024)
            return `${mb.toFixed(2)} MB`;
        return `${(mb / 1024).toFixed(2)} GB`;
    }
    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0)
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0)
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0)
            return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    exportPrometheusMetrics() {
        const metrics = this.getMetrics();
        const lines = [];
        lines.push(`# HELP sse_connections_active Number of active SSE connections`);
        lines.push(`# TYPE sse_connections_active gauge`);
        lines.push(`sse_connections_active ${metrics.connections.active}`);
        lines.push(`# HELP sse_managers_active Number of managers with active connections`);
        lines.push(`# TYPE sse_managers_active gauge`);
        lines.push(`sse_managers_active ${metrics.connections.managers}`);
        lines.push(`# HELP sse_events_processed_total Total events processed`);
        lines.push(`# TYPE sse_events_processed_total counter`);
        lines.push(`sse_events_processed_total ${metrics.events.processed}`);
        lines.push(`# HELP sse_events_per_second Events per second`);
        lines.push(`# TYPE sse_events_per_second gauge`);
        lines.push(`sse_events_per_second ${metrics.connections.throughput.eventsPerSecond}`);
        lines.push(`# HELP sse_memory_heap_used_bytes Heap memory used`);
        lines.push(`# TYPE sse_memory_heap_used_bytes gauge`);
        lines.push(`sse_memory_heap_used_bytes ${process.memoryUsage().heapUsed}`);
        return lines.join('\n');
    }
};
exports.SSEMetricsService = SSEMetricsService;
exports.SSEMetricsService = SSEMetricsService = SSEMetricsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sse_connection_manager_service_1.SSEConnectionManagerService,
        sse_event_bridge_service_1.SSEEventBridgeService])
], SSEMetricsService);
//# sourceMappingURL=sse-metrics.service.js.map