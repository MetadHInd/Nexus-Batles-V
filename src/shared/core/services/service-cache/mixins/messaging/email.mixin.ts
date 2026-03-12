import { EmailService } from '../../../../messaging/email/services/email.service';
import { EmailMessage } from '../../../../messaging/email/interfaces/email-message.interface';
import { EmailResult } from '../../../../messaging/email/interfaces/email-result.interface';

export interface WithEmail {
  emailService?: EmailService;
  send(message: EmailMessage): Promise<EmailResult>;
  sendWithTemplate(templateName: string, data: any, to: string | string[], subject: string, from?: string): Promise<EmailResult>;
  generateTemplate(templateName: string, data: any): Promise<string>;
  validateConfig(): boolean;
}

export class EmailMixin {
  public emailService?: EmailService;

  async send(message: EmailMessage): Promise<EmailResult> {
    if (!this.emailService) {
      throw new Error('EmailService not initialized');
    }
    return await this.emailService.send(message);
  }

  validateConfig(): boolean {
    return !!this.emailService;
  }

  async sendWithTemplate(
    templateName: string,
    data: any,
    to: string | string[],
    subject: string,
    from?: string,
  ): Promise<EmailResult> {
    if (!this.emailService) {
      throw new Error('EmailService not initialized');
    }
    return await this.emailService.sendWithTemplate(templateName, data, to, subject, from);
  }

  async generateTemplate(templateName: string, data: any): Promise<string> {
    if (!this.emailService) {
      throw new Error('EmailService not initialized');
    }
    return await this.emailService.generateTemplate(templateName, data);
  }
}

export function WithEmail<T extends new (...args: any[]) => {}>(Base: T) {
  return class extends Base implements WithEmail {
    emailService?: EmailService;

    async send(message: EmailMessage): Promise<EmailResult> {
      const mixin = new EmailMixin();
      mixin.emailService = this.emailService;
      return await mixin.send(message);
    }

    validateConfig(): boolean {
      return !!this.emailService;
    }

    async sendWithTemplate(
      templateName: string,
      data: any,
      to: string | string[],
      subject: string,
      from?: string,
    ): Promise<EmailResult> {
      const mixin = new EmailMixin();
      mixin.emailService = this.emailService;
      return await mixin.sendWithTemplate(templateName, data, to, subject, from);
    }

    async generateTemplate(templateName: string, data: any): Promise<string> {
      const mixin = new EmailMixin();
      mixin.emailService = this.emailService;
      return await mixin.generateTemplate(templateName, data);
    }
  };
}
