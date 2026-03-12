"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesModule = void 0;
const common_1 = require("@nestjs/common");
const module_controller_1 = require("./controllers/module.controller");
const module_service_1 = require("./services/module.service");
const cache_module_1 = require("../../shared/cache/cache.module");
const permissions_module_1 = require("../permissions/permissions.module");
let ModulesModule = class ModulesModule {
};
exports.ModulesModule = ModulesModule;
exports.ModulesModule = ModulesModule = __decorate([
    (0, common_1.Module)({
        imports: [cache_module_1.CacheModule, permissions_module_1.PermissionsModule],
        controllers: [module_controller_1.ModuleController],
        providers: [module_service_1.ModuleService],
        exports: [module_service_1.ModuleService],
    })
], ModulesModule);
//# sourceMappingURL=module.module.js.map