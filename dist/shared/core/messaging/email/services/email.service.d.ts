import { EmailSMTPConfig } from '../interfaces/email-config.interface';
import { EmailMessage } from '../interfaces/email-message.interface';
import { EmailResult } from '../interfaces/email-result.interface';
import { IEmailSender } from '../interfaces/email-sender.interface';
import { EmailTemplateService } from './email-template.service';
export declare class EmailService implements IEmailSender {
    private readonly templateService;
    private readonly logger;
    private readonly circuitBreaker;
    constructor(templateService: EmailTemplateService);
    send(email: EmailMessage): Promise<EmailResult>;
    sendBulk(config: EmailSMTPConfig, emails: EmailMessage[]): Promise<EmailResult[]>;
    sendWithTemplate(templateName: string, data: Record<string, any>, to: string | string[], subject: string, from?: string): Promise<EmailResult>;
    generateTemplate(templateName: string, data: Record<string, any>): Promise<string>;
}
