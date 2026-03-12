import { Injectable, Logger } from '@nestjs/common';
import { 
  ISmsStrategy, 
  IWhatsAppStrategy, 
  MessagingConfig,
  PhoneNumberConfig,
} from './strategies/messaging-strategy.interface';
import { TwilioStrategy } from './strategies/twilio.strategy';
import { SmsMessage, SmsResult } from '../../core/messaging/sms/interfaces/sms-message.interface';
import { WhatsAppMessage, WhatsAppResult } from '../../core/messaging/whatsapp/interfaces/whatsapp-message.interface';
import { PrismaService } from '../../database/prisma.service';
import { FirestoreMessagingService } from '../../database/firestore-messaging.service';
import { MessageChannel, MessageDirection } from '../../database/interfaces/firestore-message.interface';

/**
 * Manager de estrategias de mensajería
 * Implementa patrón Strategy para múltiples proveedores
 * Guarda todos los mensajes en Firestore
 */
@Injectable()
export class MessagingStrategyManager {
  private readonly logger = new Logger(MessagingStrategyManager.name);
  private strategies = new Map<string, ISmsStrategy | IWhatsAppStrategy>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly twilioStrategy: TwilioStrategy,
    private readonly firestoreMessaging: FirestoreMessagingService,
  ) {
    // Registrar estrategias disponibles
    this.registerStrategy('twilio', twilioStrategy);
  }

  /**
   * Registrar una nueva estrategia
   */
  registerStrategy(name: string, strategy: ISmsStrategy | IWhatsAppStrategy): void {
    this.strategies.set(name, strategy);
    this.logger.log(`Strategy registered: ${name}`);
  }

  /**
   * Obtener estrategia por nombre
   */
  getStrategy(name: string): ISmsStrategy | IWhatsAppStrategy | undefined {
    return this.strategies.get(name);
  }

  /**
   * Obtener configuración de servicio desde BD
   */
  async getServiceConfig(serviceId: string): Promise<MessagingConfig | null> {
    try {
      // TODO: Implementar query a tabla messaging_service
      // Por ahora, usar variables de entorno como fallback
      
      const config: MessagingConfig = {
        serviceId,
        serviceName: 'default',
        provider: 'twilio',
        phoneNumberId: process.env.TWILIO_PHONE_NUMBER || '',
        credentials: {
          accountSid: process.env.TWILIO_ACCOUNT_SID,
          authToken: process.env.TWILIO_AUTH_TOKEN,
        },
      };

      return config;
    } catch (error) {
      this.logger.error(`Error getting service config: ${error.message}`);
      return null;
    }
  }

  /**
   * Obtener número de teléfono disponible para un servicio
   */
  async getPhoneNumber(serviceId: string): Promise<PhoneNumberConfig | null> {
    try {
      // TODO: Query a tabla phone_numbers
      // SELECT * FROM phone_numbers WHERE service_id = ? AND is_active = true LIMIT 1
      
      // Fallback a env
      return {
        id: '1',
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
        provider: 'twilio',
        serviceId,
        isActive: true,
        capabilities: {
          sms: true,
          voice: true,
          whatsapp: true,
        },
      };
    } catch (error) {
      this.logger.error(`Error getting phone number: ${error.message}`);
      return null;
    }
  }

  /**
   * Enviar SMS usando estrategia apropiada
   */
  async sendSms(
    message: SmsMessage,
    serviceId: string = 'default',
  ): Promise<SmsResult> {
    try {
      const config = await this.getServiceConfig(serviceId);
      
      if (!config) {
        return {
          success: false,
          error: 'Service configuration not found',
        };
      }

      const strategy = this.getStrategy(config.provider) as ISmsStrategy;
      
      if (!strategy) {
        return {
          success: false,
          error: `Strategy not found: ${config.provider}`,
        };
      }

      if (!strategy.validateConfig(config)) {
        return {
          success: false,
          error: 'Invalid configuration',
        };
      }

      const result = await strategy.sendSms(message, config);

      // Guardar mensaje en Firestore
      try {
        const conversationId = `sms_${message.to}_${config.phoneNumberId}`;
        await this.firestoreMessaging.saveOutboundMessage({
          conversationId,
          channel: MessageChannel.SMS,
          from: config.phoneNumberId,
          to: Array.isArray(message.to) ? message.to[0] : message.to,
          body: message.body,
          serviceId,
          provider: config.provider,
          providerMessageId: result.messageId,
          metadata: message.metadata,
        });
      } catch (firestoreError) {
        this.logger.error(`Error saving SMS to Firestore: ${firestoreError.message}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error in sendSms: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Enviar WhatsApp usando estrategia apropiada
   */
  async sendWhatsApp(
    message: WhatsAppMessage,
    serviceId: string = 'default',
  ): Promise<WhatsAppResult> {
    try {
      const config = await this.getServiceConfig(serviceId);
      
      if (!config) {
        return {
          success: false,
          error: `Configuration not found for service: ${serviceId}`,
        };
      }

      const strategy = this.getStrategy(config.provider) as IWhatsAppStrategy;
      
      if (!strategy) {
        return {
          success: false,
          error: `Strategy not found: ${config.provider}`,
        };
      }

      if (!strategy.validateConfig(config)) {
        return {
          success: false,
          error: 'Invalid configuration',
        };
      }

      const result = await strategy.sendWhatsApp(message, config);

      // Guardar mensaje en Firestore
      try {
        const conversationId = `whatsapp_${message.to}_${config.phoneNumberId}`;
        await this.firestoreMessaging.saveOutboundMessage({
          conversationId,
          channel: MessageChannel.WHATSAPP,
          from: config.phoneNumberId,
          to: message.to,
          body: message.body,
          serviceId,
          provider: config.provider,
          providerMessageId: result.messageId,
          metadata: message.metadata,
        });
      } catch (firestoreError) {
        this.logger.error(`Error saving WhatsApp to Firestore: ${firestoreError.message}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error in sendWhatsApp: ${error.message}`);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Listar estrategias disponibles
   */
  listStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }

  /**
   * Validar si una estrategia está disponible
   */
  hasStrategy(name: string): boolean {
    return this.strategies.has(name);
  }
}
