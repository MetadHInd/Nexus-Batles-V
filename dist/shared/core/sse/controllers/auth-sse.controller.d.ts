import { Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { BaseSSEController } from './base-sse.controller';
import { SSEConnectionManagerService } from '../services/sse-connection-manager.service';
export declare class AuthSSEController extends BaseSSEController {
    protected readonly logger: Logger;
    constructor(connectionManager: SSEConnectionManagerService);
    streamAuthenticatedEvents(req: Request): Observable<MessageEvent>;
}
