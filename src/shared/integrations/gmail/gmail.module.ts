// gmail.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GmailService } from './basic/services';
import { GmailController } from './basic/controllers';
import { GmailAutomationService, GmailAutomationController } from './automation';

@Module({
  imports: [HttpModule],
  controllers: [GmailController, GmailAutomationController],
  providers: [GmailService, GmailAutomationService],
  exports: [GmailService, GmailAutomationService],
})
export class GmailModule {}