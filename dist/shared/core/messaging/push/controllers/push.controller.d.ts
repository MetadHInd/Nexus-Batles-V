import { PushService } from '../services/push.service';
import { PushResult } from '../interfaces/push-result.interface';
import { SendPushDto, SendBulkPushDto } from '../dtos/push-dtos';
export declare class PushController {
    private readonly pushService;
    constructor(pushService: PushService);
    send(dto: SendPushDto): Promise<PushResult>;
    sendBulk(dto: SendBulkPushDto): Promise<PushResult[]>;
}
