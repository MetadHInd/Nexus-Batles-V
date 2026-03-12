import { Module } from '@nestjs/common';
import { RolePermissionController } from './controllers/role-permission.controller';
import { RolePermissionService } from './services/role-permission.service';
import { CacheModule } from 'src/shared/cache/cache.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [CacheModule, PermissionsModule],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionsModule {}
