import { HttpService } from '@nestjs/axios';
import { PushMessage } from '../interfaces/push-message.interface';
import { PushResult } from '../interfaces/push-result.interface';
import { IPushSender } from '../interfaces/push-sender.interface';
export declare class PushService implements IPushSender {
    private readonly httpService;
    private readonly logger;
    private readonly circuitBreaker;
    constructor(httpService: HttpService);
    send(message: PushMessage): Promise<PushResult>;
    sendBulk(messages: PushMessage[]): Promise<PushResult[]>;
    private sendOneSignalPush;
    private sendFirebasePush;
}
