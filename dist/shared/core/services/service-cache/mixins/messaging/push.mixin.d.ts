import { PushService } from '../../../../messaging/push/services/push.service';
import { PushMessage } from '../../../../messaging/push/interfaces/push-message.interface';
import { PushResult } from '../../../../messaging/push/interfaces/push-result.interface';
export interface WithPush {
    pushService?: PushService;
    send(message: PushMessage): Promise<PushResult>;
    validateConfig(): boolean;
}
export declare class PushMixin {
    pushService?: PushService;
    send(message: PushMessage): Promise<PushResult>;
    validateConfig(): boolean;
}
export declare function WithPush<T extends new (...args: any[]) => {}>(Base: T): {
    new (...args: any[]): {
        pushService?: PushService;
        send(message: PushMessage): Promise<PushResult>;
        validateConfig(): boolean;
    };
} & T;
