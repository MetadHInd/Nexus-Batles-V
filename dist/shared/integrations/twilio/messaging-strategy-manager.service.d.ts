import { ISmsStrategy, IWhatsAppStrategy, MessagingConfig, PhoneNumberConfig } from './strategies/messaging-strategy.interface';
import { TwilioStrategy } from './strategies/twilio.strategy';
import { SmsMessage, SmsResult } from '../../core/messaging/sms/interfaces/sms-message.interface';
import { WhatsAppMessage, WhatsAppResult } from '../../core/messaging/whatsapp/interfaces/whatsapp-message.interface';
import { PrismaService } from '../../database/prisma.service';
import { FirestoreMessagingService } from '../../database/firestore-messaging.service';
export declare class MessagingStrategyManager {
    private readonly prisma;
    private readonly twilioStrategy;
    private readonly firestoreMessaging;
    private readonly logger;
    private strategies;
    constructor(prisma: PrismaService, twilioStrategy: TwilioStrategy, firestoreMessaging: FirestoreMessagingService);
    registerStrategy(name: string, strategy: ISmsStrategy | IWhatsAppStrategy): void;
    getStrategy(name: string): ISmsStrategy | IWhatsAppStrategy | undefined;
    getServiceConfig(serviceId: string): Promise<MessagingConfig | null>;
    getPhoneNumber(serviceId: string): Promise<PhoneNumberConfig | null>;
    sendSms(message: SmsMessage, serviceId?: string): Promise<SmsResult>;
    sendWhatsApp(message: WhatsAppMessage, serviceId?: string): Promise<WhatsAppResult>;
    listStrategies(): string[];
    hasStrategy(name: string): boolean;
}
