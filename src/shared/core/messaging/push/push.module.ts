import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PushService } from './services/push.service';
import { PushController } from './controllers/push.controller';

@Module({
  imports: [HttpModule],
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule {}
