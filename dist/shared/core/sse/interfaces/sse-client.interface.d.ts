import { Response } from 'express';
export interface SSEClient {
    id: string;
    managerId: string;
    tenantId: string;
    response: Response;
    connectedAt: Date;
    lastHeartbeat: Date;
    lastEventId?: string;
    metadata?: SSEClientMetadata;
}
export interface SSEClientMetadata {
    userAgent?: string;
    ip?: string;
    sessionId?: string;
    [key: string]: any;
}
export interface SSEConnectionOptions {
    heartbeatInterval?: number;
    connectionTimeout?: number;
    maxRetries?: number;
    retryInterval?: number;
    maxPayloadSize?: number;
    enableCompression?: boolean;
}
export interface SSEConnectionStats {
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
}
