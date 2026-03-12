// src/integrations/twilio/twilio.module.ts
import { Module } from '@nestjs/common';
import { TwilioStrategy } from './strategies/twilio.strategy';
import { MessagingStrategyManager } from './messaging-strategy-manager.service';
import { MessagingStrategyController } from './controllers/messaging-strategy.controller';

@Module({
  imports: [],
  controllers: [MessagingStrategyController],
  providers: [TwilioStrategy, MessagingStrategyManager],
  exports: [TwilioStrategy, MessagingStrategyManager],
})
export class TwilioModule {}
