import { EmailService } from '../email/services/email.service';
import { PushService } from '../push/services/push.service';
import { SmsService } from '../sms/services/sms.service';
import { WhatsAppService } from '../whatsapp/services/whatsapp.service';
export declare enum MessagingProvider {
    EMAIL = "email",
    PUSH = "push",
    SMS = "sms",
    WHATSAPP = "whatsapp"
}
export declare class MessagingProviderFactory {
    private readonly emailService;
    private readonly pushService;
    private readonly smsService;
    private readonly whatsAppService;
    private readonly logger;
    constructor(emailService: EmailService, pushService: PushService, smsService: SmsService, whatsAppService: WhatsAppService);
    getProvider(provider: MessagingProvider): any;
    getAvailableProviders(): MessagingProvider[];
}
