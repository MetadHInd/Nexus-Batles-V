import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerManagerService } from './scheduler-manager.service';
import { SchedulerManagerController } from './scheduler-manager.controller';

@Global()
@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SchedulerManagerService],
  controllers: [SchedulerManagerController],
  exports: [SchedulerManagerService],
})
export class SchedulerManagerModule {}
