import { SmsService } from '../../../../messaging/sms/services/sms.service';
import { SmsMessage } from '../../../../messaging/sms/interfaces/sms-message.interface';
import { SmsResult } from '../../../../messaging/sms/interfaces/sms-result.interface';
export interface WithSms {
    smsService?: SmsService;
    send(message: SmsMessage): Promise<SmsResult>;
    sendToNumbers(phoneNumbers: string[], text: string, providerId?: number): Promise<SmsResult>;
    validateConfig(): boolean;
}
export declare class SmsMixin {
    smsService?: SmsService;
    send(message: SmsMessage): Promise<SmsResult>;
    sendToNumbers(phoneNumbers: string[], text: string, providerId?: number): Promise<SmsResult>;
    sendWithTemplate(templateName: string, data: any, phoneNumbers: string[]): Promise<SmsResult>;
    validateConfig(): boolean;
}
export declare function WithSms<T extends new (...args: any[]) => {}>(Base: T): {
    new (...args: any[]): {
        smsService?: SmsService;
        send(message: SmsMessage): Promise<SmsResult>;
        sendToNumbers(phoneNumbers: string[], text: string, providerId?: number): Promise<SmsResult>;
        validateConfig(): boolean;
    };
} & T;
