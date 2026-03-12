import { EmailService } from 'src/shared/core/messaging/email/services/email.service';
import { EmailTemplateService } from 'src/shared/core/messaging/email/services/email-template.service';
type Constructor<T = object> = new (...args: any[]) => T;
export declare function WithEmailService<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        readonly _emailTemplateService: EmailTemplateService;
        readonly _emailService: EmailService;
        get EmailService(): EmailService;
    };
} & TBase;
export {};
