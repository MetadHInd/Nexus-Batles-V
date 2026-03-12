import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';

/**
 * Servicio para configurar webhooks de Twilio automáticamente
 */
@Injectable()
export class TwilioWebhookConfigService {
  private readonly logger = new Logger(TwilioWebhookConfigService.name);
  private client: Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (accountSid && authToken) {
      this.client = new Twilio(accountSid, authToken);
    }
  }

  /**
   * Obtener la URL base del servidor actual
   */
  getBaseUrl(): string {
    // Prioridad 1: Variable de entorno explícita
    if (process.env.API_BASE_URL) {
      return process.env.API_BASE_URL;
    }

    // Prioridad 2: URL de producción
    if (process.env.PRODUCTION_URL) {
      return process.env.PRODUCTION_URL;
    }

    // Prioridad 3: Detectar según NODE_ENV
    if (process.env.NODE_ENV === 'production') {
      // En producción, debes tener configurada la URL
      this.logger.warn('⚠️ API_BASE_URL not set in production environment');
      return 'https://api.tu-dominio.com'; // Fallback
    }

    // Desarrollo: localhost
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}`;
  }

  /**
   * Generar URLs de webhook
   */
  getWebhookUrls() {
    const baseUrl = this.getBaseUrl();
    // URL unificada para todos los eventos (sin /api/messaging)
    const unifiedWebhook = `${baseUrl}/sms/webhook`;

    return {
      baseUrl,
      // URL principal unificada
      unified: unifiedWebhook,
      // Todas las URLs apuntan al mismo endpoint unificado
      statusCallback: unifiedWebhook,
      incomingSms: unifiedWebhook,
      conversationsWebhook: unifiedWebhook,
      healthCheck: `${baseUrl}/sms/webhook/health`,
    };
  }

  /**
   * Configurar webhook en número de teléfono de Twilio
   */
  async configurePhoneNumberWebhooks(phoneNumber?: string): Promise<any> {
    try {
      const phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;
      
      if (!phone) {
        throw new Error('Phone number not provided and TWILIO_PHONE_NUMBER not set');
      }

      this.logger.log(`📞 Configuring webhooks for phone number: ${phone}`);

      // Buscar el número en Twilio
      const phoneNumbers = await this.client.incomingPhoneNumbers.list({
        phoneNumber: phone,
      });

      if (phoneNumbers.length === 0) {
        throw new Error(`Phone number ${phone} not found in Twilio account`);
      }

      const phoneNumberSid = phoneNumbers[0].sid;
      const urls = this.getWebhookUrls();

      // Configurar webhooks
      const updatedNumber = await this.client
        .incomingPhoneNumbers(phoneNumberSid)
        .update({
          smsUrl: urls.incomingSms,
          smsMethod: 'POST',
          statusCallback: urls.statusCallback,
          statusCallbackMethod: 'POST',
        });

      this.logger.log(`✅ Webhooks configured successfully for ${phone}`);

      return {
        success: true,
        phoneNumber: phone,
        phoneSid: phoneNumberSid,
        webhooks: {
          incomingSms: urls.incomingSms,
          statusCallback: urls.statusCallback,
        },
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`❌ Error configuring phone webhooks: ${error.message}`);
      throw error;
    }
  }

  /**
   * Configurar webhook en Messaging Service
   */
  async configureMessagingServiceWebhooks(
    messagingServiceSid?: string,
  ): Promise<any> {
    try {
      const serviceSid =
        messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;

      if (!serviceSid) {
        this.logger.warn('⚠️ No Messaging Service SID provided, skipping');
        return { success: false, reason: 'No Messaging Service SID' };
      }

      this.logger.log(
        `📨 Configuring webhooks for Messaging Service: ${serviceSid}`,
      );

      const urls = this.getWebhookUrls();

      const updatedService = await this.client.messaging.v1
        .services(serviceSid)
        .update({
          statusCallback: urls.statusCallback,
          inboundRequestUrl: urls.incomingSms,
          inboundMethod: 'POST',
        });

      this.logger.log(
        `✅ Messaging Service webhooks configured successfully`,
      );

      return {
        success: true,
        messagingServiceSid: serviceSid,
        webhooks: {
          incomingSms: urls.incomingSms,
          statusCallback: urls.statusCallback,
        },
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `❌ Error configuring Messaging Service webhooks: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Configurar webhook en Conversations Service
   */
  async configureConversationsWebhooks(
    conversationServiceSid?: string,
  ): Promise<any> {
    try {
      // Si no se proporciona SID, usar el default
      const serviceSid = conversationServiceSid || 'default';

      this.logger.log(
        `💬 Configuring webhooks for Conversations Service: ${serviceSid}`,
      );

      const urls = this.getWebhookUrls();

      // Configurar webhook global de Conversations
      const webhook = await this.client.conversations.v1.configuration
        .webhooks()
        .update({
          postWebhookUrl: urls.conversationsWebhook,
          method: 'POST',
          filters: ['onMessageAdded', 'onMessageUpdated'],
        });

      this.logger.log(`✅ Conversations webhooks configured successfully`);

      return {
        success: true,
        conversationServiceSid: serviceSid,
        webhooks: {
          postWebhook: urls.conversationsWebhook,
          filters: ['onMessageAdded', 'onMessageUpdated'],
        },
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `❌ Error configuring Conversations webhooks: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Configurar todos los webhooks automáticamente
   */
  async configureAllWebhooks(config?: {
    phoneNumber?: string;
    messagingServiceSid?: string;
    conversationServiceSid?: string;
  }): Promise<any> {
    this.logger.log('🚀 Starting automatic webhook configuration...');

    // Usar valores del config o del .env
    const phoneNumber = config?.phoneNumber || process.env.TWILIO_PHONE_NUMBER;
    const messagingServiceSid = config?.messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;
    const conversationServiceSid = config?.conversationServiceSid;

    this.logger.log(`📱 Phone Number: ${phoneNumber}`);
    if (messagingServiceSid) {
      this.logger.log(`📦 Messaging Service SID: ${messagingServiceSid}`);
    }
    if (conversationServiceSid) {
      this.logger.log(`💬 Conversation Service SID: ${conversationServiceSid}`);
    }

    const results: any = {
      baseUrl: this.getBaseUrl(),
      phoneNumber: null,
      messagingService: null,
      conversations: null,
      timestamp: new Date().toISOString(),
    };

    try {
      // 1. Configurar teléfono
      try {
        results.phoneNumber = await this.configurePhoneNumberWebhooks(phoneNumber);
      } catch (error) {
        this.logger.warn(`Phone number webhook config failed: ${error.message}`);
        results.phoneNumber = { success: false, error: error.message };
      }

      // 2. Configurar Messaging Service (si existe)
      try {
        results.messagingService =
          await this.configureMessagingServiceWebhooks(messagingServiceSid);
      } catch (error) {
        this.logger.warn(
          `Messaging Service webhook config failed: ${error.message}`,
        );
        results.messagingService = { success: false, error: error.message };
      }

      // 3. Configurar Conversations
      try {
        results.conversations = await this.configureConversationsWebhooks(conversationServiceSid);
      } catch (error) {
        this.logger.warn(
          `Conversations webhook config failed: ${error.message}`,
        );
        results.conversations = { success: false, error: error.message };
      }

      this.logger.log('✅ Webhook configuration completed');

      return results;
    } catch (error) {
      this.logger.error(`❌ Error in webhook configuration: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verificar webhooks configurados
   */
  async verifyWebhooks(phoneNumber?: string): Promise<any> {
    try {
      const phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;

      if (!phone) {
        throw new Error('Phone number not provided');
      }

      const phoneNumbers = await this.client.incomingPhoneNumbers.list({
        phoneNumber: phone,
      });

      if (phoneNumbers.length === 0) {
        throw new Error(`Phone number ${phone} not found`);
      }

      const number = phoneNumbers[0];

      return {
        phoneNumber: phone,
        phoneSid: number.sid,
        currentWebhooks: {
          smsUrl: number.smsUrl,
          smsMethod: number.smsMethod,
          statusCallback: number.statusCallback,
          statusCallbackMethod: number.statusCallbackMethod,
        },
        expectedWebhooks: this.getWebhookUrls(),
      };
    } catch (error) {
      this.logger.error(`Error verifying webhooks: ${error.message}`);
      throw error;
    }
  }
}
