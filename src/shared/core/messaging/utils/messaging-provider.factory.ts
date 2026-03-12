import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/services/email.service';
import { PushService } from '../push/services/push.service';
import { SmsService } from '../sms/services/sms.service';
import { WhatsAppService } from '../whatsapp/services/whatsapp.service';

export enum MessagingProvider {
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
}

@Injectable()
export class MessagingProviderFactory {
  private readonly logger = new Logger(MessagingProviderFactory.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
    private readonly smsService: SmsService,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  getProvider(provider: MessagingProvider): any {
    switch (provider) {
      case MessagingProvider.EMAIL:
        return this.emailService;
      case MessagingProvider.PUSH:
        return this.pushService;
      case MessagingProvider.SMS:
        return this.smsService;
      case MessagingProvider.WHATSAPP:
        return this.whatsAppService;
      default:
        throw new Error(`Unknown messaging provider: ${provider}`);
    }
  }

  getAvailableProviders(): MessagingProvider[] {
    return Object.values(MessagingProvider);
  }
}
