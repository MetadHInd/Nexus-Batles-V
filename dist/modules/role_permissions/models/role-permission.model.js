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
exports.RolePermissionDetailModel = exports.RolePermissionModel = void 0;
const swagger_1 = require("@nestjs/swagger");
class RolePermissionModel {
    id;
    role_id;
    permission_id;
    tenant_ids;
    is_active;
    constructor(id, role_id, permission_id, tenant_ids, is_active) {
        this.id = id;
        this.role_id = role_id;
        this.permission_id = permission_id;
        this.tenant_ids = tenant_ids;
        this.is_active = is_active;
    }
    cacheKey() {
        return `role_permission:${this.id}`;
    }
    cacheTTL() {
        return 3600;
    }
    toJSON() {
        return {
            id: this.id,
            role_id: this.role_id,
            permission_id: this.permission_id,
            tenant_ids: this.tenant_ids,
            is_active: this.is_active,
        };
    }
    static fromJSON(json) {
        return new RolePermissionModel(json.id, json.role_id, json.permission_id, json.tenant_ids, json.is_active);
    }
}
exports.RolePermissionModel = RolePermissionModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID único del role_permission',
    }),
    __metadata("design:type", Number)
], RolePermissionModel.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID del rol',
    }),
    __metadata("design:type", Number)
], RolePermissionModel.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID del permiso',
    }),
    __metadata("design:type", Number)
], RolePermissionModel.prototype, "permission_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['development', 'production'],
        description: 'IDs de tenants asociados',
        type: [String],
    }),
    __metadata("design:type", Array)
], RolePermissionModel.prototype, "tenant_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Indica si el permiso está activo para este rol',
    }),
    __metadata("design:type", Boolean)
], RolePermissionModel.prototype, "is_active", void 0);
class RolePermissionDetailModel extends RolePermissionModel {
    permission;
    role;
    toJSON() {
        return {
            id: this.id,
            role_id: this.role_id,
            permission_id: this.permission_id,
            tenant_ids: this.tenant_ids,
            ...(this.permission && { permission: this.permission }),
            ...(this.role && { role: this.role }),
        };
    }
    static fromJSON(json) {
        const model = new RolePermissionDetailModel(json.id, json.role_id, json.permission_id, json.tenant_ids, json.is_active);
        if (json.permission)
            model.permission = json.permission;
        if (json.role)
            model.role = json.role;
        return model;
    }
}
exports.RolePermissionDetailModel = RolePermissionDetailModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            id: 1,
            code: 'CREATE_ORDER',
            name: 'Create Order',
            description: 'Allows user to create new orders',
            is_active: true,
        },
        description: 'Detalles del permiso',
        required: false,
    }),
    __metadata("design:type", Object)
], RolePermissionDetailModel.prototype, "permission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            idrole: 1,
            description: 'Administrator',
        },
        description: 'Detalles del rol',
        required: false,
    }),
    __metadata("design:type", Object)
], RolePermissionDetailModel.prototype, "role", void 0);
//# sourceMappingURL=role-permission.model.js.map