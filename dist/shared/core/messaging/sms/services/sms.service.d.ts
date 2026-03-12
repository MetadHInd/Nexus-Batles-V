import { ISmsService } from '../core/interfaces/ISmsService.interface';
import { SmsMessage } from '../interfaces/sms-message.interface';
import { SmsResult } from '../interfaces/sms-result.interface';
export declare class SmsService implements ISmsService {
    private readonly logger;
    send(message: SmsMessage): Promise<SmsResult>;
    sendBulk(messages: SmsMessage[]): Promise<SmsResult[]>;
}
