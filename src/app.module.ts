import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { CacheModule } from './shared/cache/cache.module';
import { AuthModule } from './shared/core/auth/auth.module';
import { MessagingModule } from './shared/core/messaging/messaging.module';
import { ActionsModule } from './modules/actions/';
import { PermissionsModule } from './modules/permissions/';
import { RolePermissionsModule } from './modules/role_permissions/';
import { RoleModule } from './modules/role/';
import { ModulesModule } from './modules/module/';
import { SchedulerManagerModule } from './shared/core/services/scheduler/scheduler-manager.module';

// ✅ CONTROLADOR DE DEBUG TEMPORAL
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './shared/database/prisma.service';


@Controller('debug')
class DebugController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async healthCheck() {
    return await ServiceCache.Database.Prisma.healthCheck();
  }

  @Get('performance')
  async performanceTest() {
    return await ServiceCache.Database.Prisma.performanceTest();
  }

  @Get('connection-info')
  getConnectionInfo() {
    return {
      accelerateEnabled: process.env.DATABASE_URL?.includes('accelerate.prisma-data.net') || false,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      databaseUrlDev: process.env.DATABASE_URL_DEV ? 'SET' : 'NOT SET',
      usedUrl: process.env.DATABASE_URL || process.env.DATABASE_URL_DEV || 'NONE',
      timestamp: new Date().toISOString()
    };
  }

  @Get('simple-query')
  async simpleQuery() {
    const start = Date.now();
    try {
      const result = await ServiceCache.Database.Prisma.sysUser.count();
      const duration = Date.now() - start;
      
      return {
        success: true,
        result,
        duration: `${duration}ms`,
        accelerate: process.env.DATABASE_URL?.includes('accelerate') || false
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        duration: `${Date.now() - start}ms`
      };
    }
  }
}

import { GmailModule } from './shared/integrations/gmail/gmail.module';
import { ServiceCache } from './shared/core/services/service-cache/service-cache';
import { GoogleCloudStorageModule } from './shared/services/google-cloud-storage/google-cloud-storage.module';

// 🎯 MÓDULOS DE PERMISOS Y AUTORIZACIÓN

// 📡 MÓDULO SSE (Server-Sent Events)
import { SSEModule } from './shared/core/sse/sse.module';

@Module({
  imports: [
    GoogleCloudStorageModule,
    SchedulerManagerModule,
    DatabaseModule,
    CacheModule,
    AuthModule,
    MessagingModule,
    GmailModule,
    SSEModule, // 📡 Server-Sent Events
    // Módulos de permisos
    RoleModule,
    PermissionsModule,
    RolePermissionsModule,
    ActionsModule,
    ModulesModule,
  ],
  controllers: [AppController, DebugController],
  providers: [AppService],
})
export class AppModule {}
