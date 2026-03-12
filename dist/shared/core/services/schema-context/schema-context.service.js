"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaContextService = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
let SchemaContextService = class SchemaContextService {
    asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
    run(context, callback) {
        return this.asyncLocalStorage.run(context, callback);
    }
    getContext() {
        return this.asyncLocalStorage.getStore();
    }
    getCurrentSchema() {
        const context = this.getContext();
        return context?.schemaName;
    }
    getCurrentTenantUuid() {
        const context = this.getContext();
        return context?.tenantUuid;
    }
    hasContext() {
        return this.getContext() !== undefined;
    }
    clearContext() {
    }
};
exports.SchemaContextService = SchemaContextService;
exports.SchemaContextService = SchemaContextService = __decorate([
    (0, common_1.Injectable)()
], SchemaContextService);
//# sourceMappingURL=schema-context.service.js.map