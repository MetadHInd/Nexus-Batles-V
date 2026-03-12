import { SmsService } from '../../../../messaging/sms/services/sms.service';
import { SmsMessage } from '../../../../messaging/sms/interfaces/sms-message.interface';
import { SmsResult } from '../../../../messaging/sms/interfaces/sms-result.interface';

export interface WithSms {
  smsService?: SmsService;
  send(message: SmsMessage): Promise<SmsResult>;
  sendToNumbers(phoneNumbers: string[], text: string, providerId?: number): Promise<SmsResult>;
  validateConfig(): boolean;
}

export class SmsMixin {
  public smsService?: SmsService;

  async send(message: SmsMessage): Promise<SmsResult> {
    if (!this.smsService) {
      throw new Error('SmsService not initialized');
    }
    return await this.smsService.send(message);
  }

  async sendToNumbers(
    phoneNumbers: string[],
    text: string,
    providerId?: number,
  ): Promise<SmsResult> {
    if (!this.smsService) {
      throw new Error('SmsService not initialized');
    }

    const message: SmsMessage = {
      to: phoneNumbers,
      body: text,
      providerId,
    };

    return await this.smsService.send(message);
  }

  async sendWithTemplate(
    templateName: string,
    data: any,
    phoneNumbers: string[],
  ): Promise<SmsResult> {
    if (!this.smsService) {
      throw new Error('SmsService not initialized');
    }

    // TODO: Implement template rendering
    const text = `Template: ${templateName}`;
    
    return await this.sendToNumbers(phoneNumbers, text);
  }

  validateConfig(): boolean {
    return !!this.smsService;
  }
}

export function WithSms<T extends new (...args: any[]) => {}>(Base: T) {
  return class extends Base implements WithSms {
    smsService?: SmsService;

    async send(message: SmsMessage): Promise<SmsResult> {
      const mixin = new SmsMixin();
      mixin.smsService = this.smsService;
      return await mixin.send(message);
    }

    async sendToNumbers(
      phoneNumbers: string[],
      text: string,
      providerId?: number,
    ): Promise<SmsResult> {
      const mixin = new SmsMixin();
      mixin.smsService = this.smsService;
      return await mixin.sendToNumbers(phoneNumbers, text, providerId);
    }

    validateConfig(): boolean {
      return !!this.smsService;
    }
  };
}
