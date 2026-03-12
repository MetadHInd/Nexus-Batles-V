import { WhatsAppService } from '../../../../messaging/whatsapp/services/whatsapp.service';
import { WhatsAppMessage, WhatsAppInteractiveListMessage } from '../../../../messaging/whatsapp/interfaces/whatsapp-message.interface';
import { WhatsAppResult } from '../../../../messaging/whatsapp/interfaces/whatsapp-result.interface';

export interface WithWhatsApp {
  whatsAppService?: WhatsAppService;
  send(message: WhatsAppMessage): Promise<WhatsAppResult>;
  sendText(to: string, text: string): Promise<WhatsAppResult>;
  sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult>;
  validateConfig(): boolean;
}

export class WhatsAppMixin {
  public whatsAppService?: WhatsAppService;

  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    if (!this.whatsAppService) {
      throw new Error('WhatsAppService not initialized');
    }
    return await this.whatsAppService.send(message);
  }

  async sendText(to: string, text: string): Promise<WhatsAppResult> {
    if (!this.whatsAppService) {
      throw new Error('WhatsAppService not initialized');
    }

    const message: WhatsAppMessage = {
      to,
      body: text,
      type: 'text',
    };

    return await this.whatsAppService.send(message);
  }

  async sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult> {
    if (!this.whatsAppService) {
      throw new Error('WhatsAppService not initialized');
    }
    return await this.whatsAppService.sendInteractive(message);
  }

  async sendWithAttachment(
    to: string,
    text: string,
    attachmentUrl: string,
    type: 'image' | 'document' | 'audio',
  ): Promise<WhatsAppResult> {
    if (!this.whatsAppService) {
      throw new Error('WhatsAppService not initialized');
    }

    const message: WhatsAppMessage = {
      to,
      body: text,
      type,
      mediaUrl: attachmentUrl,
    };

    return await this.whatsAppService.send(message);
  }

  validateConfig(): boolean {
    return !!this.whatsAppService;
  }
}

export function WithWhatsApp<T extends new (...args: any[]) => {}>(Base: T) {
  return class extends Base implements WithWhatsApp {
    whatsAppService?: WhatsAppService;

    async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
      const mixin = new WhatsAppMixin();
      mixin.whatsAppService = this.whatsAppService;
      return await mixin.send(message);
    }

    async sendText(to: string, text: string): Promise<WhatsAppResult> {
      const mixin = new WhatsAppMixin();
      mixin.whatsAppService = this.whatsAppService;
      return await mixin.sendText(to, text);
    }

    async sendInteractive(message: WhatsAppInteractiveListMessage): Promise<WhatsAppResult> {
      const mixin = new WhatsAppMixin();
      mixin.whatsAppService = this.whatsAppService;
      return await mixin.sendInteractive(message);
    }

    validateConfig(): boolean {
      return !!this.whatsAppService;
    }
  };
}
