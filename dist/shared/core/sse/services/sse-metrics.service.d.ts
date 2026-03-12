import { SSEConnectionManagerService } from './sse-connection-manager.service';
import { SSEEventBridgeService } from './sse-event-bridge.service';
export declare class SSEMetricsService {
    private readonly connectionManager;
    private readonly eventBridge;
    private readonly logger;
    private readonly startTime;
    constructor(connectionManager: SSEConnectionManagerService, eventBridge: SSEEventBridgeService);
    getMetrics(): {
        timestamp: string;
        uptime: {
            milliseconds: number;
            seconds: number;
            formatted: string;
        };
        connections: {
            active: number;
            managers: number;
            tenants: number;
            byManager: {
                managerId: string;
                connections: number;
            }[];
            byTenant: {
                tenantId: string;
                connections: number;
            }[] | undefined;
            throughput: {
                eventsSent: number;
                bytesSent: number;
                eventsPerSecond: number;
                bytesPerSecond: number;
            };
        };
        events: {
            processed: number;
            byType: {
                [k: string]: number;
            };
            activeGroups: {
                name: string;
                listeners: number;
            }[];
            totalGroups: number;
        };
        health: {
            status: "healthy" | "warning" | "critical" | "idle";
            issues: string[] | undefined;
            checks: {
                connections: string;
                memory: string;
                uptime: string;
            };
        };
        system: {
            memory: {
                heapUsed: string;
                heapTotal: string;
                heapUsedPercent: number;
                external: string;
                rss: string;
            };
            cpu: {
                user: number;
                system: number;
            };
            process: {
                pid: number;
                nodeVersion: string;
                platform: NodeJS.Platform;
                arch: NodeJS.Architecture;
            };
        };
    };
    private getConnectionMetrics;
    private getEventMetrics;
    getHealthStatus(): {
        status: "healthy" | "warning" | "critical" | "idle";
        issues: string[] | undefined;
        checks: {
            connections: string;
            memory: string;
            uptime: string;
        };
    };
    private getSystemMetrics;
    private getUptime;
    healthCheck(): {
        status: string;
        timestamp: string;
        details: {
            status: "healthy" | "warning" | "critical" | "idle";
            issues: string[] | undefined;
            checks: {
                connections: string;
                memory: string;
                uptime: string;
            };
        };
    };
    readinessCheck(): {
        ready: boolean;
        timestamp: string;
        checks: {
            connections: string;
            memory: string;
            uptime: string;
        };
    };
    livenessCheck(): {
        alive: boolean;
        uptime: number;
        timestamp: string;
    };
    getDashboardStats(): {
        summary: {
            activeConnections: number;
            activeManagers: number;
            eventsPerSecond: number;
            healthStatus: "healthy" | "warning" | "critical" | "idle";
            uptime: string;
        };
        recommendations: string[];
        timestamp: string;
        uptime: {
            milliseconds: number;
            seconds: number;
            formatted: string;
        };
        connections: {
            active: number;
            managers: number;
            tenants: number;
            byManager: {
                managerId: string;
                connections: number;
            }[];
            byTenant: {
                tenantId: string;
                connections: number;
            }[] | undefined;
            throughput: {
                eventsSent: number;
                bytesSent: number;
                eventsPerSecond: number;
                bytesPerSecond: number;
            };
        };
        events: {
            processed: number;
            byType: {
                [k: string]: number;
            };
            activeGroups: {
                name: string;
                listeners: number;
            }[];
            totalGroups: number;
        };
        health: {
            status: "healthy" | "warning" | "critical" | "idle";
            issues: string[] | undefined;
            checks: {
                connections: string;
                memory: string;
                uptime: string;
            };
        };
        system: {
            memory: {
                heapUsed: string;
                heapTotal: string;
                heapUsedPercent: number;
                external: string;
                rss: string;
            };
            cpu: {
                user: number;
                system: number;
            };
            process: {
                pid: number;
                nodeVersion: string;
                platform: NodeJS.Platform;
                arch: NodeJS.Architecture;
            };
        };
    };
    private getRecommendations;
    private formatBytes;
    private formatUptime;
    exportPrometheusMetrics(): string;
}
