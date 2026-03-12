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
exports.RoleModel = void 0;
const swagger_1 = require("@nestjs/swagger");
class RoleModel {
    idrole;
    description;
    tenant_ids;
    is_super;
    hierarchy_level;
    constructor(idrole, description, tenant_ids, is_super, hierarchy_level = 50) {
        this.idrole = idrole;
        this.description = description;
        this.tenant_ids = tenant_ids;
        this.is_super = is_super;
        this.hierarchy_level = hierarchy_level;
    }
    cacheKey() {
        return `role:${this.idrole}`;
    }
    cacheTTL() {
        return 3600;
    }
    toJSON() {
        return {
            idrole: this.idrole,
            description: this.description,
            tenant_ids: this.tenant_ids,
            is_super: this.is_super,
            hierarchy_level: this.hierarchy_level,
        };
    }
    static fromJSON(json) {
        return new RoleModel(json.idrole, json.description, json.tenant_ids, json.is_super, json.hierarchy_level || 50);
    }
    static fromPrisma(data) {
        return new RoleModel(data.idrole, data.description, data.tenant_ids, data.is_super, data.hierarchy_level || 50);
    }
}
exports.RoleModel = RoleModel;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Unique role ID',
    }),
    __metadata("design:type", Number)
], RoleModel.prototype, "idrole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Administrador',
        description: 'Role description',
        maxLength: 45,
    }),
    __metadata("design:type", Object)
], RoleModel.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['development', 'production'],
        description: 'Associated tenant IDs',
        type: [String],
    }),
    __metadata("design:type", Array)
], RoleModel.prototype, "tenant_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Indicates if it is a super administrator role',
    }),
    __metadata("design:type", Object)
], RoleModel.prototype, "is_super", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
        minimum: 1,
        maximum: 100,
    }),
    __metadata("design:type", Number)
], RoleModel.prototype, "hierarchy_level", void 0);
//# sourceMappingURL=role.model.js.map