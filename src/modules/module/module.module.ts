import { Module } from '@nestjs/common';
import { ModuleController } from './controllers/module.controller';
import { ModuleService } from './services/module.service';
import { CacheModule } from 'src/shared/cache/cache.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [CacheModule, PermissionsModule],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModulesModule {}
