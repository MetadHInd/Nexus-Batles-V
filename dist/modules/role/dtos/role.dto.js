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
exports.RoleResponseDto = exports.RolePaginationDto = exports.UpdateRoleDto = exports.CreateRoleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../shared/common/dtos/pagination.dto");
const class_transformer_1 = require("class-transformer");
class CreateRoleDto {
    description;
    permission_ids;
    is_super;
    hierarchy_level;
}
exports.CreateRoleDto = CreateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Administrador del Sistema',
        description: 'Role description',
        maxLength: 45,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(45),
    __metadata("design:type", String)
], CreateRoleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [1, 2, 3],
        description: 'Permission IDs to assign to the role',
        required: false,
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], CreateRoleDto.prototype, "permission_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Indicates if it is a super administrator role',
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRoleDto.prototype, "is_super", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
        required: false,
        default: 50,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateRoleDto.prototype, "hierarchy_level", void 0);
class UpdateRoleDto {
    description;
    permission_ids;
    is_super;
    hierarchy_level;
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Administrador del Sistema',
        description: 'Role description',
        maxLength: 45,
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(45),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [1, 2, 3],
        description: 'Permission IDs to assign to the role (replaces existing permissions)',
        required: false,
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Array)
], UpdateRoleDto.prototype, "permission_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Indicates if it is a super administrator role',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRoleDto.prototype, "is_super", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
        required: false,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], UpdateRoleDto.prototype, "hierarchy_level", void 0);
class RolePaginationDto extends pagination_dto_1.PaginationDto {
    search;
    tenant_id;
}
exports.RolePaginationDto = RolePaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'admin',
        description: 'Search by role description',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RolePaginationDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'development',
        description: 'Filter by tenant ID',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RolePaginationDto.prototype, "tenant_id", void 0);
class RoleResponseDto {
    idrole;
    description;
    tenant_ids;
    is_super;
    hierarchy_level;
}
exports.RoleResponseDto = RoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Role ID',
    }),
    __metadata("design:type", Number)
], RoleResponseDto.prototype, "idrole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Administrador del Sistema',
        description: 'Role description',
    }),
    __metadata("design:type", Object)
], RoleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['development'],
        description: 'Associated tenant IDs',
        type: [String],
    }),
    __metadata("design:type", Array)
], RoleResponseDto.prototype, "tenant_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Indicates if it is a super administrator role',
    }),
    __metadata("design:type", Object)
], RoleResponseDto.prototype, "is_super", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 50,
        description: 'Hierarchical level of the role (1-100). Higher number = higher authority',
    }),
    __metadata("design:type", Number)
], RoleResponseDto.prototype, "hierarchy_level", void 0);
//# sourceMappingURL=role.dto.js.map