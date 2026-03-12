import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { BaseSSEController } from './base-sse.controller';
import { SSEConnectionManagerService } from '../services/sse-connection-manager.service';
import { SSERateLimitGuard } from '../guards/sse-rate-limit.guard';
export declare class TestSSEController extends BaseSSEController {
    private readonly rateLimitGuard;
    protected readonly logger: Logger;
    constructor(connectionManager: SSEConnectionManagerService, rateLimitGuard: SSERateLimitGuard);
    streamMinimal(req: Request): Observable<any>;
    streamTestEvents(req: Request): Observable<MessageEvent>;
    private getClientIp;
    sendTestEvent(body: {
        managerId: string;
        eventType: string;
        payload: any;
    }): Promise<{
        success: boolean;
        sent: number;
        message: string;
    }>;
    forceDisconnect(body: {
        managerId: string;
        reason?: string;
    }): Promise<{
        success: boolean;
        disconnected: number;
        message: string;
    }>;
    getManagerSessions(req: Request): Promise<{
        managerId: string;
        sessionsCount: number;
        sessions: Array<{
            clientId: string;
            connectedAt: Date;
            lastHeartbeat: Date;
            metadata?: any;
        }>;
    }>;
    toggleSingleSessionMode(body: {
        enabled: boolean;
    }): Promise<{
        success: boolean;
        singleSessionMode: boolean;
        message: string;
    }>;
    getStatus(): Promise<{
        singleSessionMode: boolean;
        metrics: any;
        timestamp: string;
    }>;
    broadcast(body: {
        eventType: string;
        payload: any;
    }): Promise<{
        success: boolean;
        sent: number;
        message: string;
    }>;
}
