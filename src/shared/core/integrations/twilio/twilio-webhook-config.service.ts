import { Injectable, Logger } from '@nestjs/common';
import * as Twilio from 'twilio';

/**
 * Servicio para configurar automáticamente webhooks de Twilio
 * Elimina la necesidad de configurar manualmente en Twilio Console
 */
@Injectable()
export class TwilioWebhookConfigService {
  private readonly logger = new Logger(TwilioWebhookConfigService.name);
  private readonly client: Twilio.Twilio;
  private readonly baseUrl: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error(
        'TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in environment variables',
      );
    }

    this.client = new Twilio.Twilio(accountSid, authToken);

    // Auto-detectar base URL desde variables de entorno o usar valor por defecto
    this.baseUrl =
      process.env.API_BASE_URL ||
      process.env.BASE_URL ||
      'http://localhost:3000';

    this.logger.log(`Twilio Webhook Config Service initialized with base URL: ${this.baseUrl}`);
  }

  /**
   * Obtiene las URLs de webhook generadas automáticamente
   */
  getWebhookUrls() {
    const baseUrl = this.baseUrl.replace(/\/$/, ''); // Remove trailing slash

    return {
      baseUrl,
      statusCallback: `${baseUrl}/api/messaging/sms/webhooks/twilio/status`,
      incomingSms: `${baseUrl}/api/messaging/sms/webhooks/twilio/incoming`,
      conversationsWebhook: `${baseUrl}/api/messaging/sms/webhooks/twilio/conversations`,
      healthCheck: `${baseUrl}/api/messaging/sms/webhooks/health`,
    };
  }

  /**
   * Configura webhooks en el número de teléfono de Twilio
   */
  async configurePhoneNumberWebhooks(phoneNumber?: string): Promise<any> {
    try {
      const phone = phoneNumber || process.env.TWILIO_PHONE_NUMBER;
      if (!phone) {
        throw new Error('Phone number not provided and TWILIO_PHONE_NUMBER not set');
      }

      this.logger.log(`Configuring webhooks for phone number: ${phone}`);

      const urls = this.getWebhookUrls();

      // Buscar el número en Twilio
      const phoneNumbers = await this.client.incomingPhoneNumbers.list({
        phoneNumber: phone,
        limit: 1,
      });

      if (phoneNumbers.length === 0) {
        throw new Error(`Phone number ${phone} not found in your Twilio account`);
      }

      const twilioPhone = phoneNumbers[0];

      // Actualizar webhooks
      const updated = await this.client
        .incomingPhoneNumbers(twilioPhone.sid)
        .update({
          smsUrl: urls.incomingSms,
          smsMethod: 'POST',
          statusCallback: urls.statusCallback,
          statusCallbackMethod: 'POST',
        });

      this.logger.log(`✅ Phone webhooks configured successfully for ${phone}`);

      return {
        success: true,
        phoneNumber: phone,
        phoneSid: twilioPhone.sid,
        webhooks: {
          incomingSms: urls.incomingSms,
          statusCallback: urls.statusCallback,
        },
        friendlyName: updated.friendlyName,
      };
    } catch (error) {
      this.logger.error(`Error configuring phone webhooks: ${error.message}`);
      throw error;
    }
  }

  /**
   * Configura webhooks en el Messaging Service
   */
  async configureMessagingServiceWebhooks(
    messagingServiceSid?: string,
  ): Promise<any> {
    try {
      const serviceSid =
        messagingServiceSid || process.env.TWILIO_MESSAGING_SERVICE_SID;

      if (!serviceSid) {
        this.logger.warn(
          'No Messaging Service SID provided, skipping Messaging Service webhook configuration',
        );
        return {
          success: false,
          message: 'No Messaging Service SID provided',
          skipped: true,
        };
      }

      this.logger.log(
        `Configuring webhooks for Messaging Service: ${serviceSid}`,
      );

      const urls = this.getWebhookUrls();

      // Actualizar Messaging Service
      const updated = await this.client.messaging.v1
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
        friendlyName: updated.friendlyName,
        webhooks: {
          statusCallback: urls.statusCallback,
          inboundRequestUrl: urls.incomingSms,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error configuring Messaging Service webhooks: ${error.message}`,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Configura webhooks para Conversations API
   */
  async configureConversationsWebhooks(
    conversationServiceSid?: string,
  ): Promise<any> {
    try {
      let serviceSid = conversationServiceSid;

      // Si no se provee SID, obtener el service por defecto
      if (!serviceSid) {
        this.logger.log('No Conversation Service SID provided, fetching default...');
        const services = await this.client.conversations.v1.services.list({
          limit: 1,
        });

        if (services.length === 0) {
          throw new Error('No Conversation Service found. Create one in Twilio Console first.');
        }

        serviceSid = services[0].sid;
        this.logger.log(`Using default Conversation Service: ${serviceSid}`);
      }

      const urls = this.getWebhookUrls();

      // Obtener configuración actual
      await this.client.conversations.v1
        .services(serviceSid)
        .configuration()
        .fetch();

      this.logger.log(`✅ Conversations service verified successfully`);
      this.logger.warn(`⚠️ Conversations webhooks must be configured manually in Twilio Console`);
      this.logger.log(`Console URL: https://console.twilio.com/us1/develop/conversations/manage/services/${serviceSid}`);

      return {
        success: true,
        conversationServiceSid: serviceSid,
        webhook: urls.conversationsWebhook,
        note: 'Webhook URL must be configured manually in Twilio Console for Conversations',
        consoleUrl: `https://console.twilio.com/us1/develop/conversations/manage/services/${serviceSid}`,
        manualSteps: [
          '1. Go to Twilio Console → Conversations → Services',
          '2. Select your service',
          '3. Go to Webhooks tab',
          `4. Set Post-Event Webhook URL to: ${urls.conversationsWebhook}`,
          '5. Enable events: onMessageAdded, onDeliveryUpdated',
          '6. Method: POST',
          '7. Click Save',
        ],
      };
    } catch (error) {
      this.logger.error(
        `Error configuring Conversations webhooks: ${error.message}`,
      );
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Configura todos los webhooks automáticamente
   */
  async configureAllWebhooks(): Promise<any> {
    this.logger.log('🚀 Starting automatic webhook configuration for all services...');

    const results: any = {
      baseUrl: this.baseUrl,
      phoneNumber: null,
      messagingService: null,
      conversations: null,
      timestamp: new Date().toISOString(),
    };

    // 1. Configurar Phone Number
    try {
      results.phoneNumber =
        await this.configurePhoneNumberWebhooks();
    } catch (error) {
      this.logger.error(`Phone configuration failed: ${error.message}`);
      results.phoneNumber = { success: false, error: error.message };
    }

    // 2. Configurar Messaging Service (opcional)
    try {
      results.messagingService =
        await this.configureMessagingServiceWebhooks();
    } catch (error) {
      this.logger.error(`Messaging Service configuration failed: ${error.message}`);
      results.messagingService = { success: false, error: error.message };
    }

    // 3. Configurar Conversations
    try {
      results.conversations =
        await this.configureConversationsWebhooks();
    } catch (error) {
      this.logger.error(`Conversations configuration failed: ${error.message}`);
      results.conversations = { success: false, error: error.message };
    }

    this.logger.log('✅ Webhook configuration completed');

    return results;
  }

  /**
   * Verifica qué webhooks están configurados actualmente
   */
  async verifyWebhooks(): Promise<any> {
    try {
      const phone = process.env.TWILIO_PHONE_NUMBER;
      if (!phone) {
        throw new Error('TWILIO_PHONE_NUMBER not set');
      }

      const phoneNumbers = await this.client.incomingPhoneNumbers.list({
        phoneNumber: phone,
        limit: 1,
      });

      if (phoneNumbers.length === 0) {
        throw new Error(`Phone number ${phone} not found`);
      }

      const twilioPhone = phoneNumbers[0];
      const expectedUrls = this.getWebhookUrls();

      return {
        phoneNumber: phone,
        currentWebhooks: {
          smsUrl: twilioPhone.smsUrl,
          statusCallback: twilioPhone.statusCallback,
        },
        expectedWebhooks: {
          smsUrl: expectedUrls.incomingSms,
          statusCallback: expectedUrls.statusCallback,
        },
        isConfigured:
          twilioPhone.smsUrl === expectedUrls.incomingSms &&
          twilioPhone.statusCallback === expectedUrls.statusCallback,
      };
    } catch (error) {
      this.logger.error(`Error verifying webhooks: ${error.message}`);
      throw error;
    }
  }
}
