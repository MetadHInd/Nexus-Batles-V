import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { PushModule } from './push/push.module';
import { SmsModule } from './sms/sms.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { MessagingProviderFactory } from './utils/messaging-provider.factory';
import { MessagingController } from './controllers/messaging.controller';
import { MessageLoggerService } from './services/message-logger.service';

/**
 * Módulo de mensajería completo
 * Incluye: Email, Push, SMS y WhatsApp
 */
@Module({
  imports: [EmailModule, PushModule, SmsModule, WhatsAppModule],
  controllers: [MessagingController],
  providers: [MessagingProviderFactory, MessageLoggerService],
  exports: [
    EmailModule,
    PushModule,
    SmsModule,
    WhatsAppModule,
    MessagingProviderFactory,
    MessageLoggerService,
  ],
})
export class MessagingModule {}

