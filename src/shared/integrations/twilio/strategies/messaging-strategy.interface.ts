/**
 * Strategy Pattern para proveedores de mensajería
 */

import { SmsMessage, SmsResult } from '../../../core/messaging/sms/interfaces/sms-message.interface';
import { WhatsAppMessage, WhatsAppResult } from '../../../core/messaging/whatsapp/interfaces/whatsapp-message.interface';

/**
 * Interface base para estrategias de mensajería SMS
 */
export interface ISmsStrategy {
  readonly name: string;
  readonly type: 'sms' | 'whatsapp' | 'both';
  
  sendSms(message: SmsMessage, config?: MessagingConfig): Promise<SmsResult>;
  sendBulkSms(messages: SmsMessage[], config?: MessagingConfig): Promise<SmsResult[]>;
  validateConfig(config: MessagingConfig): boolean;
}

/**
 * Interface para estrategias de WhatsApp
 */
export interface IWhatsAppStrategy {
  readonly name: string;
  
  sendWhatsApp(message: WhatsAppMessage, config?: MessagingConfig): Promise<WhatsAppResult>;
  sendInteractive(message: any, config?: MessagingConfig): Promise<WhatsAppResult>;
  validateConfig(config: MessagingConfig): boolean;
}

/**
 * Configuración de mensajería por servicio
 */
export interface MessagingConfig {
  serviceId: string;
  serviceName: string;
  provider: string;
  phoneNumberId: string;
  credentials: {
    accountSid?: string;
    authToken?: string;
    apiKey?: string;
    [key: string]: any;
  };
  metadata?: Record<string, any>;
}

/**
 * Información de número de teléfono
 */
export interface PhoneNumberConfig {
  id: string;
  phoneNumber: string;
  provider: string;
  serviceId: string;
  isActive: boolean;
  capabilities: {
    sms: boolean;
    voice: boolean;
    whatsapp: boolean;
  };
  metadata?: Record<string, any>;
}
