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
export declare class EmailMixin {
    emailService?: EmailService;
    send(message: EmailMessage): Promise<EmailResult>;
    validateConfig(): boolean;
    sendWithTemplate(templateName: string, data: any, to: string | string[], subject: string, from?: string): Promise<EmailResult>;
    generateTemplate(templateName: string, data: any): Promise<string>;
}
export declare function WithEmail<T extends new (...args: any[]) => {}>(Base: T): {
    new (...args: any[]): {
        emailService?: EmailService;
        send(message: EmailMessage): Promise<EmailResult>;
        validateConfig(): boolean;
        sendWithTemplate(templateName: string, data: any, to: string | string[], subject: string, from?: string): Promise<EmailResult>;
        generateTemplate(templateName: string, data: any): Promise<string>;
    };
} & T;
