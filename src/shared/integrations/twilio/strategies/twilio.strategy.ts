import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { 
  ISmsStrategy, 
  IWhatsAppStrategy, 
  MessagingConfig,
} from './messaging-strategy.interface';
import { SmsMessage, SmsResult } from '../../../core/messaging/sms/interfaces/sms-message.interface';
import { WhatsAppMessage, WhatsAppResult } from '../../../core/messaging/whatsapp/interfaces/whatsapp-message.interface';

/**
 * Estrategia Twilio para SMS y WhatsApp
 * Implementación limpia sin lógica de negocio
 */
@Injectable()
export class TwilioStrategy implements ISmsStrategy, IWhatsAppStrategy {
  readonly name = 'twilio';
  readonly type = 'both' as const;
  
  private readonly logger = new Logger(TwilioStrategy.name);
  private clientCache = new Map<string, Twilio>();

  /**
   * Obtener cliente Twilio (cacheado por credenciales)
   */
  private getClient(config: MessagingConfig): Twilio {
    const key = `${config.credentials.accountSid}`;
    
    if (!this.clientCache.has(key)) {
      const client = new Twilio(
        config.credentials.accountSid!,
        config.credentials.authToken!,
      );
      this.clientCache.set(key, client);
    }
    
    return this.clientCache.get(key)!;
  }

  /**
   * Validar configuración de Twilio
   */
  validateConfig(config: MessagingConfig): boolean {
    return !!(
      config.credentials.accountSid &&
      config.credentials.authToken &&
      config.phoneNumberId
    );
  }

  /**
   * Enviar SMS
   */
  async sendSms(message: SmsMessage, config?: MessagingConfig): Promise<SmsResult> {
    try {
      if (!config) {
        throw new Error('MessagingConfig is required');
      }

      if (!this.validateConfig(config)) {
        throw new Error('Invalid Twilio configuration');
      }

      const client = this.getClient(config);
      
      const twilioMessage = await client.messages.create({
        body: message.body,
        to: Array.isArray(message.to) ? message.to[0] : message.to,
        from: message.from || config.phoneNumberId,
        ...(message.metadata?.mediaUrl && { mediaUrl: [message.metadata.mediaUrl] }),
      });

      this.logger.log(`SMS sent via Twilio: ${twilioMessage.sid}`);

      return {
        success: true,
        messageId: twilioMessage.sid,
        details: {
          status: twilioMessage.status,
          to: twilioMessage.to,
          from: twilioMessage.from,
        },
      };
    } catch (error) {
      this.logger.error(`Error sending SMS via Twilio: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Enviar SMS masivo
   */
  async sendBulkSms(messages: SmsMessage[], config?: MessagingConfig): Promise<SmsResult[]> {
    const results: SmsResult[] = [];
    
    for (const message of messages) {
      const result = await this.sendSms(message, config);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Enviar WhatsApp
   */
  async sendWhatsApp(message: WhatsAppMessage, config?: MessagingConfig): Promise<WhatsAppResult> {
    try {
      if (!config) {
        throw new Error('MessagingConfig is required');
      }

      if (!this.validateConfig(config)) {
        throw new Error('Invalid Twilio configuration');
      }

      const client = this.getClient(config);
      
      // WhatsApp en Twilio usa formato whatsapp:+number
      const whatsappTo = message.to.startsWith('whatsapp:') 
        ? message.to 
        : `whatsapp:${message.to}`;
      
      const whatsappFrom = config.phoneNumberId.startsWith('whatsapp:')
        ? config.phoneNumberId
        : `whatsapp:${config.phoneNumberId}`;

      const twilioMessage = await client.messages.create({
        body: message.body,
        to: whatsappTo,
        from: whatsappFrom,
        ...(message.mediaUrl && { mediaUrl: [message.mediaUrl] }),
      });

      this.logger.log(`WhatsApp sent via Twilio: ${twilioMessage.sid}`);

      return {
        success: true,
        messageId: twilioMessage.sid,
        details: {
          status: twilioMessage.status,
          to: twilioMessage.to,
          from: twilioMessage.from,
        },
      };
    } catch (error) {
      this.logger.error(`Error sending WhatsApp via Twilio: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Enviar WhatsApp interactivo
   */
  async sendInteractive(message: any, config?: MessagingConfig): Promise<WhatsAppResult> {
    // TODO: Implementar mensajes interactivos de WhatsApp
    this.logger.warn('Interactive WhatsApp messages not yet implemented');
    
    return {
      success: false,
      error: 'Interactive messages not implemented',
    };
  }
}
