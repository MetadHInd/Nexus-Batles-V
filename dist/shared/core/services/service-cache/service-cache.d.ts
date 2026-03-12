import { EmailService } from '../../messaging/email/services/email.service';
import { PushService } from '../../messaging/push/services/push.service';
import { SmsService } from '../../messaging/sms/services/sms.service';
import { WhatsAppService } from '../../messaging/whatsapp/services/whatsapp.service';
import { MessagingProvider } from './mixins/messaging/messaging.mixin';
import { DatabaseInterface } from './mixins/database/database.mixin';
import { FirestoreService } from '../../../database/firestore.service';
import { EmailMessage } from '../../messaging/email/interfaces/email-message.interface';
import { EmailResult } from '../../messaging/email/interfaces/email-result.interface';
import { PushMessage } from '../../messaging/push/interfaces/push-message.interface';
import { PushResult } from '../../messaging/push/interfaces/push-result.interface';
import { SmsMessage } from '../../messaging/sms/interfaces/sms-message.interface';
import { SmsResult } from '../../messaging/sms/interfaces/sms-result.interface';
import { WhatsAppMessage, WhatsAppInteractiveListMessage } from '../../messaging/whatsapp/interfaces/whatsapp-message.interface';
import { WhatsAppResult } from '../../messaging/whatsapp/interfaces/whatsapp-result.interface';
declare class BaseService {
    emailService?: EmailService;
    pushService?: PushService;
    smsService?: SmsService;
    whatsAppService?: WhatsAppService;
    messagingFactory?: any;
}
declare const Mixed: {
    new (...args: any[]): {
        whatsAppService?: WhatsAppService;
        send(message: WhatsAppMessage): Promise<WhatsAppResult>;
        sendText(to: string, text: string): Promise<WhatsAppResult>;
        sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult>;
        validateConfig(): boolean;
    };
} & {
    new (...args: any[]): {
        smsService?: SmsService;
        send(message: SmsMessage): Promise<SmsResult>;
        sendToNumbers(phoneNumbers: string[], text: string, providerId?: number): Promise<SmsResult>;
        validateConfig(): boolean;
    };
} & {
    new (...args: any[]): {
        pushService?: PushService;
        send(message: PushMessage): Promise<PushResult>;
        validateConfig(): boolean;
    };
} & {
    new (...args: any[]): {
        emailService?: EmailService;
        send(message: EmailMessage): Promise<EmailResult>;
        validateConfig(): boolean;
        sendWithTemplate(templateName: string, data: any, to: string | string[], subject: string, from?: string): Promise<EmailResult>;
        generateTemplate(templateName: string, data: any): Promise<string>;
    };
} & {
    new (...args: any[]): {
        messagingFactory: import("../../messaging/utils/messaging-provider.factory").MessagingProviderFactory;
        getAvailableProviders(): string[];
        sendByProvider(provider: MessagingProvider, message: any): Promise<any>;
    };
} & {
    new (...args: any[]): {
        readonly tokenService: import("../../auth/services/shared/token.service").TokenService;
        readonly passwordService: import("../../auth/services/shared/password.service").PasswordService;
        readonly roleService: import("../../auth/services/shared/role.service").RoleService;
        readonly signatureService: import("../../auth/services/shared/signature.service").SignatureService;
        get Authorization(): {
            TokenService: import("../../auth/services/shared/token.service").TokenService;
            PasswordService: import("../../auth/services/shared/password.service").PasswordService;
            RoleService: import("../../auth/services/shared/role.service").RoleService;
            SignatureService: import("../../auth/services/shared/signature.service").SignatureService;
        };
    };
} & {
    new (...args: any[]): {
        readonly _circuitBreaker: import("../../../utils/circuit-breaker.handler").CircuitBreakerHandler;
        get CircuitBreaker(): import("../../../utils/circuit-breaker.handler").CircuitBreakerHandler;
    };
} & typeof BaseService;
type EmailNamespace = {
    send: (message: EmailMessage) => Promise<EmailResult>;
    sendWithTemplate: (templateName: string, data: any, to: string | string[], subject: string) => Promise<EmailResult>;
    validateConfig: () => boolean;
    generateTemplate: (templateName: string, data: any) => Promise<string>;
};
type PushNamespace = {
    send: (message: PushMessage) => Promise<PushResult>;
    validateConfig: () => boolean;
};
type SMSNamespace = {
    send: (message: SmsMessage) => Promise<SmsResult>;
    sendToNumbers: (phoneNumbers: string[], text: string, providerId?: number) => Promise<SmsResult>;
    sendWithTemplate: (templateName: string, data: any, phoneNumbers: string[]) => Promise<SmsResult>;
    validateConfig: () => boolean;
};
type WhatsAppNamespace = {
    send: (message: WhatsAppMessage) => Promise<WhatsAppResult>;
    sendText: (to: string, text: string) => Promise<WhatsAppResult>;
    sendInteractive: (message: WhatsAppInteractiveListMessage) => Promise<WhatsAppResult>;
    sendWithAttachment: (to: string, text: string, attachmentUrl: string, type: 'image' | 'document' | 'audio') => Promise<WhatsAppResult>;
    validateConfig: () => boolean;
};
type MessagingNamespace = {
    Email: EmailNamespace;
    Push: PushNamespace;
    SMS: SMSNamespace;
    WhatsApp: WhatsAppNamespace;
    getAvailableProviders: () => string[];
    sendByProvider: (provider: MessagingProvider, message: any) => Promise<any>;
};
export declare const ServiceCache: InstanceType<typeof Mixed> & {
    Database: DatabaseInterface & {
        Firestore: FirestoreService;
    };
    Messaging: MessagingNamespace;
};
export {};
