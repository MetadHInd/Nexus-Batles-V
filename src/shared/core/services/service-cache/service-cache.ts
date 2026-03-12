/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/shared/core/services/service-cache/service-cache.ts
import { EmailService } from '../../messaging/email/services/email.service';
import { PushService } from '../../messaging/push/services/push.service';
import { SmsService } from '../../messaging/sms/services/sms.service';
import { WhatsAppService } from '../../messaging/whatsapp/services/whatsapp.service';
import { WithAuthorization } from './mixins/authorization.mixin';
import { WithCircuitBreaker } from './mixins/circuit-breaker.mixin';
import { WithMessaging, MessagingProvider } from './mixins/messaging/messaging.mixin';
import { WithEmail, EmailMixin } from './mixins/messaging/email.mixin';
import { WithPush, PushMixin } from './mixins/messaging/push.mixin';
import { WithSms, SmsMixin } from './mixins/messaging/sms.mixin';
import { WithWhatsApp, WhatsAppMixin } from './mixins/messaging/whatsapp.mixin';
import { Database, DatabaseInterface } from './mixins/database/database.mixin';
import { FirestoreService } from '../../../database/firestore.service';

// Interfaces para tipado fuerte de mensajería
import { EmailMessage } from '../../messaging/email/interfaces/email-message.interface';
import { EmailResult } from '../../messaging/email/interfaces/email-result.interface';
import { PushMessage } from '../../messaging/push/interfaces/push-message.interface';
import { PushResult } from '../../messaging/push/interfaces/push-result.interface';
import { SmsMessage } from '../../messaging/sms/interfaces/sms-message.interface';
import { SmsResult } from '../../messaging/sms/interfaces/sms-result.interface';
import { WhatsAppMessage, WhatsAppInteractiveListMessage } from '../../messaging/whatsapp/interfaces/whatsapp-message.interface';
import { WhatsAppResult } from '../../messaging/whatsapp/interfaces/whatsapp-result.interface';

/**
 * ServiceCache con sistema de mensajería completo
 * Incluye: Database, Email, Push, SMS, WhatsApp
 */

class BaseService {
  // Servicios de mensajería como propiedades públicas
  public emailService?: EmailService;
  public pushService?: PushService;
  public smsService?: SmsService;
  public whatsAppService?: WhatsAppService;
  public messagingFactory?: any;
}

// Aplicar todos los mixins de mensajería
const Mixed = WithWhatsApp(
  WithSms(
    WithPush(
      WithEmail(
        WithMessaging(
          WithAuthorization(
            WithCircuitBreaker(BaseService)
          )
        )
      )
    )
  )
);

// Definir interfaces específicas para cada canal de mensajería
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
  
  // Métodos utilitarios globales
  getAvailableProviders: () => string[];
  sendByProvider: (provider: MessagingProvider, message: any) => Promise<any>;
};

export const ServiceCache = new Mixed() as InstanceType<typeof Mixed> & {
  Database: DatabaseInterface & { Firestore: FirestoreService };
  Messaging: MessagingNamespace;
};

ServiceCache.Database = Database;

// Crear instancias de los mixins
const emailMixinInstance = new EmailMixin();
const pushMixinInstance = new PushMixin();
const smsMixinInstance = new SmsMixin();
const whatsAppMixinInstance = new WhatsAppMixin();

const Messaging: MessagingNamespace = {
  // Namespace Email
  Email: {
    send: emailMixinInstance.send.bind(emailMixinInstance),
    sendWithTemplate: emailMixinInstance.sendWithTemplate.bind(emailMixinInstance),
    generateTemplate: emailMixinInstance.generateTemplate.bind(emailMixinInstance),
    validateConfig: emailMixinInstance.validateConfig.bind(emailMixinInstance),
  },
  
  // Namespace Push
  Push: {
    send: pushMixinInstance.send.bind(pushMixinInstance),
    validateConfig: pushMixinInstance.validateConfig.bind(pushMixinInstance),
  },
  
  // Namespace SMS
  SMS: {
    send: smsMixinInstance.send.bind(smsMixinInstance),
    sendToNumbers: smsMixinInstance.sendToNumbers.bind(smsMixinInstance),
    sendWithTemplate: smsMixinInstance.sendWithTemplate.bind(smsMixinInstance),
    validateConfig: smsMixinInstance.validateConfig.bind(smsMixinInstance),
  },
  
  // Namespace WhatsApp
  WhatsApp: {
    send: whatsAppMixinInstance.send.bind(whatsAppMixinInstance),
    sendText: whatsAppMixinInstance.sendText.bind(whatsAppMixinInstance),
    sendInteractive: whatsAppMixinInstance.sendInteractive.bind(whatsAppMixinInstance),
    sendWithAttachment: whatsAppMixinInstance.sendWithAttachment.bind(whatsAppMixinInstance),
    validateConfig: whatsAppMixinInstance.validateConfig.bind(whatsAppMixinInstance),
  },
  
  // Métodos utilitarios globales
  getAvailableProviders: ServiceCache.getAvailableProviders.bind(ServiceCache),
  sendByProvider: ServiceCache.sendByProvider.bind(ServiceCache),
};

ServiceCache.Messaging = Messaging;

