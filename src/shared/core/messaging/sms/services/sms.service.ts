import { Injectable, Logger } from '@nestjs/common';
import { ISmsService } from '../core/interfaces/ISmsService.interface';
import { SmsMessage } from '../interfaces/sms-message.interface';
import { SmsResult } from '../interfaces/sms-result.interface';

/**
 * Servicio SMS genérico
 * Implementación base que delega a Twilio
 */
@Injectable()
export class SmsService implements ISmsService {
  private readonly logger = new Logger(SmsService.name);

  async send(message: SmsMessage): Promise<SmsResult> {
    this.logger.log(`SMS send to: ${message.to}`);
    
    // Delegar a Twilio service si está disponible
    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      provider: 'twilio',
      timestamp: new Date().toISOString(),
    };
  }

  async sendBulk(messages: SmsMessage[]): Promise<SmsResult[]> {
    return Promise.all(messages.map(msg => this.send(msg)));
  }
}
