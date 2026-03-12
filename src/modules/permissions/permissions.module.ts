import { Module } from '@nestjs/common';
import { PermissionController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';
import { CacheModule } from 'src/shared/cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionsModule {}
