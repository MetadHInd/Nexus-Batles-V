import { Module, forwardRef } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { CacheModule } from 'src/shared/cache/cache.module';
import { RolePermissionsModule } from '../role_permissions/role-permissions.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    CacheModule,
    forwardRef(() => RolePermissionsModule),
    PermissionsModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
