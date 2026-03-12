import { SmsMessage } from '../../interfaces/sms-message.interface';
import { SmsResult } from '../../interfaces/sms-result.interface';
export interface ISmsService {
    send(message: SmsMessage): Promise<SmsResult>;
    sendBulk(messages: SmsMessage[]): Promise<SmsResult[]>;
}
