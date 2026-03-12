import { OnModuleDestroy } from '@nestjs/common';
import { SSEClient, SSEConnectionOptions, SSEConnectionStats } from '../interfaces/sse-client.interface';
import { SSESendOptions, SSESendResult } from '../interfaces/sse-event.interface';
export declare class SSEConnectionManagerService implements OnModuleDestroy {
    private readonly logger;
    private readonly connections;
    private readonly managerConnections;
    private readonly tenantConnections;
    private heartbeatInterval;
    private readonly config;
    private eventsSentCounter;
    private bytesSentCounter;
    private readonly startTime;
    constructor();
    updateConfig(config: Partial<SSEConnectionOptions>): void;
    onModuleDestroy(): void;
    addConnection(client: SSEClient): void;
    removeConnection(clientId: string, reason?: string): void;
    private disconnectAll;
    private disconnectPreviousSessions;
    getClient(clientId: string): SSEClient | undefined;
    isConnected(clientId: string): boolean;
    getManagerConnections(managerId: string): SSEClient[];
    getTenantConnections(tenantId: string): SSEClient[];
    getAllConnections(): SSEClient[];
    sendToClient(clientId: string, event: string, data: any, options?: SSESendOptions): boolean;
    sendToManager(managerId: string, event: string, data: any, options?: SSESendOptions): SSESendResult;
    sendToTenant(tenantId: string, event: string, data: any, options?: SSESendOptions): SSESendResult;
    broadcast(event: string, data: any, options?: SSESendOptions): SSESendResult;
    private sendToMultiple;
    private formatSSEMessage;
    private startHeartbeat;
    private stopHeartbeat;
    private performHeartbeat;
    getStats(): SSEConnectionStats;
    getMetrics(): {
        uptime: {
            milliseconds: number;
            seconds: number;
            formatted: string;
        };
        throughput: {
            eventsSent: number;
            bytesSent: number;
            eventsPerSecond: number;
            bytesPerSecond: number;
        };
        config: Required<SSEConnectionOptions> & {
            singleSessionPerManager: boolean;
        };
        totalConnections: number;
        totalManagers: number;
        connectionsByManager: Array<{
            managerId: string;
            connections: number;
        }>;
        connectionsByTenant?: Array<{
            tenantId: string;
            connections: number;
        }>;
        timestamp: Date;
    };
    private formatUptime;
    resetMetrics(): void;
    setSingleSessionMode(enabled: boolean): void;
    isSingleSessionMode(): boolean;
    disconnectManager(managerId: string, reason?: string): number;
    getManagerSessionsInfo(managerId: string): Array<{
        clientId: string;
        connectedAt: Date;
        lastHeartbeat: Date;
        metadata?: any;
    }>;
}
