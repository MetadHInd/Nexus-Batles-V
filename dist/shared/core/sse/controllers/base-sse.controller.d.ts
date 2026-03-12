import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { SSEConnectionManagerService } from '../services/sse-connection-manager.service';
import { SSEClient } from '../interfaces/sse-client.interface';
export declare abstract class BaseSSEController {
    protected readonly connectionManager: SSEConnectionManagerService;
    protected readonly logger: Logger;
    constructor(connectionManager: SSEConnectionManagerService);
    protected createSSEStream(req: Request, managerId: string, tenantId: string, metadata?: Record<string, any>, clientIp?: string, rateLimitGuard?: any): Observable<any>;
    protected sendError(clientId: string, error: string, code: string, details?: any): void;
    protected isClientConnected(clientId: string): boolean;
    protected getClientInfo(clientId: string): SSEClient | undefined;
}
