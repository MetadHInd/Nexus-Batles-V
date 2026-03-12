import { EmailSMTPConfig } from './email-config.interface';
import { EmailMessage } from './email-message.interface';
import { EmailResult } from './email-result.interface';
export interface IEmailSender {
    send(message: EmailMessage): Promise<EmailResult>;
    sendBulk(config: EmailSMTPConfig, messages: EmailMessage[]): Promise<EmailResult[]>;
}
