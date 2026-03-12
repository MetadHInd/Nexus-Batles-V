import { Module } from '@nestjs/common';
import { ActionController } from './controllers/action.controller';
import { ActionService } from './services/action.service';
import { CacheModule } from '../../shared/cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [ActionController],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionsModule {}
