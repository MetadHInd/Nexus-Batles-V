import { EmailService } from 'src/shared/core/messaging/email/services/email.service';
import { EmailTemplateService } from 'src/shared/core/messaging/email/services/email-template.service';

type Constructor<T = object> = new (...args: any[]) => T;

export function WithEmailService<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public readonly _emailTemplateService = new EmailTemplateService();
    public readonly _emailService = new EmailService(this._emailTemplateService);

    get EmailService(): EmailService {
      return this._emailService;
    }
  };
}
