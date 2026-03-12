"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const redis_cache_service_1 = require("./redis-cache.service");
const cache_management_service_1 = require("./cache-management.service");
const cache_admin_service_1 = require("./services/cache-admin.service");
const unified_cache_controller_1 = require("./controllers/unified-cache.controller");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [
            unified_cache_controller_1.UnifiedCacheController,
        ],
        providers: [redis_cache_service_1.RedisCacheService, cache_management_service_1.CacheManagementService, cache_admin_service_1.CacheAdminService],
        exports: [redis_cache_service_1.RedisCacheService, cache_management_service_1.CacheManagementService, cache_admin_service_1.CacheAdminService],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map