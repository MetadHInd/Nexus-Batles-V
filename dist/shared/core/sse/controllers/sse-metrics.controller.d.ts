import { SSEMetricsService } from '../services/sse-metrics.service';
import { SSEConnectionManagerService } from '../services/sse-connection-manager.service';
import { SSEEventBridgeService } from '../services/sse-event-bridge.service';
import { SSERateLimitGuard } from '../guards/sse-rate-limit.guard';
export declare class SSEMetricsController {
    private readonly metricsService;
    private readonly connectionManager;
    private readonly eventBridge;
    private readonly rateLimitGuard;
    constructor(metricsService: SSEMetricsService, connectionManager: SSEConnectionManagerService, eventBridge: SSEEventBridgeService, rateLimitGuard: SSERateLimitGuard);
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
    getConnections(): {
        summary: {
            total: number;
            managers: number;
            tenants: number;
        };
        connections: {
            id: string;
            managerId: string;
            tenantId: string;
            connectedAt: Date;
            lastHeartbeat: Date;
            metadata: import("..").SSEClientMetadata | undefined;
        }[];
        byManager: {
            managerId: string;
            connections: number;
        }[];
        byTenant: {
            tenantId: string;
            connections: number;
        }[] | undefined;
    };
    getEventBridgeInfo(): {
        metrics: {
            eventsProcessed: number;
            eventsByType: {
                [k: string]: number;
            };
            activeGroups: {
                name: string;
                listeners: number;
            }[];
            totalGroups: number;
        };
        groups: {
            name: string;
            info: import("..").SSEEventListenerRegistry | undefined;
        }[];
        config: Required<import("..").SSEEventBridgeConfig>;
    };
    getRateLimitStats(): {
        activeConnections: {
            [k: string]: number;
        };
        totalActiveConnections: number;
        ipsWithAttempts: number;
        config: {
            maxAttemptsPerWindow: number;
            windowMs: number;
            maxConcurrentPerIp: number;
            maxGlobalConnections: number;
            enableWhitelist: boolean;
            whitelist: string[];
        };
    };
    getPrometheusMetrics(): string;
}
