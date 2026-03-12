import { Global, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { CacheManagementService } from './cache-management.service';
import { CacheAdminService } from './services/cache-admin.service';
import { UnifiedCacheController } from './controllers/unified-cache.controller';

@Global()
@Module({
  controllers: [
    UnifiedCacheController,        // ✅ Controlador unificado (único activo)
  ],
  providers: [RedisCacheService, CacheManagementService, CacheAdminService],
  exports: [RedisCacheService, CacheManagementService, CacheAdminService],
})
export class CacheModule {}
