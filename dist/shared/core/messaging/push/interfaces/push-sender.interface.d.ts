import { PushMessage } from './push-message.interface';
import { PushResult } from './push-result.interface';
export interface IPushSender {
    send(message: PushMessage): Promise<PushResult>;
    sendBulk(messages: PushMessage[]): Promise<PushResult[]>;
}
