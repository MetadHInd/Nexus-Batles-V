import { ISmsStrategy, IWhatsAppStrategy, MessagingConfig } from './messaging-strategy.interface';
import { SmsMessage, SmsResult } from '../../../core/messaging/sms/interfaces/sms-message.interface';
import { WhatsAppMessage, WhatsAppResult } from '../../../core/messaging/whatsapp/interfaces/whatsapp-message.interface';
export declare class TwilioStrategy implements ISmsStrategy, IWhatsAppStrategy {
    readonly name = "twilio";
    readonly type: "both";
    private readonly logger;
    private clientCache;
    private getClient;
    validateConfig(config: MessagingConfig): boolean;
    sendSms(message: SmsMessage, config?: MessagingConfig): Promise<SmsResult>;
    sendBulkSms(messages: SmsMessage[], config?: MessagingConfig): Promise<SmsResult[]>;
    sendWhatsApp(message: WhatsAppMessage, config?: MessagingConfig): Promise<WhatsAppResult>;
    sendInteractive(message: any, config?: MessagingConfig): Promise<WhatsAppResult>;
}
