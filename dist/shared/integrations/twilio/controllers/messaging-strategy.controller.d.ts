import { MessagingStrategyManager } from '../messaging-strategy-manager.service';
import { SmsMessage } from '../../../core/messaging/sms/interfaces/sms-message.interface';
import { WhatsAppMessage } from '../../../core/messaging/whatsapp/interfaces/whatsapp-message.interface';
export declare class MessagingStrategyController {
    private readonly strategyManager;
    constructor(strategyManager: MessagingStrategyManager);
    listStrategies(): {
        strategies: string[];
    };
    getServiceConfig(serviceId: string): Promise<{
        success: boolean;
        config: import("../strategies/messaging-strategy.interface").MessagingConfig | null;
    }>;
    getPhoneNumber(serviceId: string): Promise<{
        success: boolean;
        phoneNumber: import("../strategies/messaging-strategy.interface").PhoneNumberConfig | null;
    }>;
    sendSms(body: {
        message: SmsMessage;
        serviceId?: string;
    }): Promise<import("../../../core/messaging/sms/interfaces/sms-message.interface").SmsResult>;
    sendWhatsApp(body: {
        message: WhatsAppMessage;
        serviceId?: string;
    }): Promise<import("../../../core/messaging/whatsapp/interfaces/whatsapp-message.interface").WhatsAppResult>;
    health(): {
        status: string;
        strategies: string[];
        timestamp: string;
    };
}
