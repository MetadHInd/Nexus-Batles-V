"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const role_permission_controller_1 = require("./controllers/role-permission.controller");
const role_permission_service_1 = require("./services/role-permission.service");
const cache_module_1 = require("../../shared/cache/cache.module");
const permissions_module_1 = require("../permissions/permissions.module");
let RolePermissionsModule = class RolePermissionsModule {
};
exports.RolePermissionsModule = RolePermissionsModule;
exports.RolePermissionsModule = RolePermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [cache_module_1.CacheModule, permissions_module_1.PermissionsModule],
        controllers: [role_permission_controller_1.RolePermissionController],
        providers: [role_permission_service_1.RolePermissionService],
        exports: [role_permission_service_1.RolePermissionService],
    })
], RolePermissionsModule);
//# sourceMappingURL=role-permissions.module.js.map