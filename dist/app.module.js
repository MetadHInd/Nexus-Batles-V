"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./shared/database/database.module");
const cache_module_1 = require("./shared/cache/cache.module");
const auth_module_1 = require("./shared/core/auth/auth.module");
const messaging_module_1 = require("./shared/core/messaging/messaging.module");
const actions_1 = require("./modules/actions/");
const permissions_1 = require("./modules/permissions/");
const role_permissions_1 = require("./modules/role_permissions/");
const role_1 = require("./modules/role/");
const module_1 = require("./modules/module/");
const scheduler_manager_module_1 = require("./shared/core/services/scheduler/scheduler-manager.module");
const common_2 = require("@nestjs/common");
const prisma_service_1 = require("./shared/database/prisma.service");
let DebugController = class DebugController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async healthCheck() {
        return await service_cache_1.ServiceCache.Database.Prisma.healthCheck();
    }
    async performanceTest() {
        return await service_cache_1.ServiceCache.Database.Prisma.performanceTest();
    }
    getConnectionInfo() {
        return {
            accelerateEnabled: process.env.DATABASE_URL?.includes('accelerate.prisma-data.net') || false,
            databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
            databaseUrlDev: process.env.DATABASE_URL_DEV ? 'SET' : 'NOT SET',
            usedUrl: process.env.DATABASE_URL || process.env.DATABASE_URL_DEV || 'NONE',
            timestamp: new Date().toISOString()
        };
    }
    async simpleQuery() {
        const start = Date.now();
        try {
            const result = await service_cache_1.ServiceCache.Database.Prisma.sysUser.count();
            const duration = Date.now() - start;
            return {
                success: true,
                result,
                duration: `${duration}ms`,
                accelerate: process.env.DATABASE_URL?.includes('accelerate') || false
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                duration: `${Date.now() - start}ms`
            };
        }
    }
};
__decorate([
    (0, common_2.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "healthCheck", null);
__decorate([
    (0, common_2.Get)('performance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "performanceTest", null);
__decorate([
    (0, common_2.Get)('connection-info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DebugController.prototype, "getConnectionInfo", null);
__decorate([
    (0, common_2.Get)('simple-query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "simpleQuery", null);
DebugController = __decorate([
    (0, common_2.Controller)('debug'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DebugController);
const gmail_module_1 = require("./shared/integrations/gmail/gmail.module");
const service_cache_1 = require("./shared/core/services/service-cache/service-cache");
const google_cloud_storage_module_1 = require("./shared/services/google-cloud-storage/google-cloud-storage.module");
const sse_module_1 = require("./shared/core/sse/sse.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            google_cloud_storage_module_1.GoogleCloudStorageModule,
            scheduler_manager_module_1.SchedulerManagerModule,
            database_module_1.DatabaseModule,
            cache_module_1.CacheModule,
            auth_module_1.AuthModule,
            messaging_module_1.MessagingModule,
            gmail_module_1.GmailModule,
            sse_module_1.SSEModule,
            role_1.RoleModule,
            permissions_1.PermissionsModule,
            role_permissions_1.RolePermissionsModule,
            actions_1.ActionsModule,
            module_1.ModulesModule,
        ],
        controllers: [app_controller_1.AppController, DebugController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map