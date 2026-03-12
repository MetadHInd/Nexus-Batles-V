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
exports.PermissionModel = void 0;
const swagger_1 = require("@nestjs/swagger");
class PermissionModel {
    id;
    code;
    name;
    description;
    is_active;
    tenant_ids;
    action_id;
    module_id;
    slug;
    constructor(id, code, name, description, is_active, tenant_ids, action_id, module_id, slug) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.is_active = is_active;
        this.tenant_ids = tenant_ids;
        this.action_id = action_id;
        this.module_id = module_id;
        this.slug = slug;
    }
    cacheKey() {
        return `permission:${this.id}`;
    }
    cacheTTL() {
        return 3600;
    }
    toJSON() {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            description: this.description,
            is_active: this.is_active,
            tenant_ids: this.tenant_ids,
            action_id: this.action_id,
            module_id: this.module_id,
            slug: this.slug,
        };
    }
    static fromJSON(json) {
        return new PermissionModel(json.id, json.code, json.name, json.description, json.is_active, json.tenant_ids, json.action_id, json.module_id, json.slug);
    }
}
exports.PermissionModel = PermissionModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID único del permiso',
    }),
    __metadata("design:type", Number)
], PermissionModel.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'CREATE_ORDER',
        description: 'Código único del permiso',
    }),
    __metadata("design:type", String)
], PermissionModel.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Create Order',
        description: 'Nombre descriptivo del permiso',
    }),
    __metadata("design:type", String)
], PermissionModel.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Allows user to create new orders',
        description: 'Descripción detallada del permiso',
        required: false,
    }),
    __metadata("design:type", Object)
], PermissionModel.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Indica si el permiso está activo',
    }),
    __metadata("design:type", Boolean)
], PermissionModel.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['development', 'production'],
        description: 'IDs de tenants asociados',
        type: [String],
    }),
    __metadata("design:type", Array)
], PermissionModel.prototype, "tenant_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID de la acción asociada',
        required: false,
    }),
    __metadata("design:type", Object)
], PermissionModel.prototype, "action_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID del módulo asociado',
    }),
    __metadata("design:type", Number)
], PermissionModel.prototype, "module_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'orders-management:create',
        description: 'Slug único del permiso',
        required: false,
    }),
    __metadata("design:type", Object)
], PermissionModel.prototype, "slug", void 0);
//# sourceMappingURL=permission.model.js.map