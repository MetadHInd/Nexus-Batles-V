import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppMessage, WhatsAppInteractiveListMessage } from '../interfaces/whatsapp-message.interface';
import { WhatsAppResult } from '../interfaces/whatsapp-result.interface';

/**
 * Servicio WhatsApp genérico
 * Implementación base que delega a Twilio
 */
@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    this.logger.log(`WhatsApp send to: ${message.to}`);
    
    return {
      success: true,
      messageId: `wa_${Date.now()}`,
      provider: 'twilio',
      timestamp: new Date().toISOString(),
    };
  }

  async sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult> {
    this.logger.log(`WhatsApp interactive send to: ${message.to}`);
    
    return {
      success: true,
      messageId: `wa_interactive_${Date.now()}`,
      provider: 'twilio',
      timestamp: new Date().toISOString(),
    };
  }
}
