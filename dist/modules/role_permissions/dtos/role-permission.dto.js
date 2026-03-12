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
exports.AssignPermissionsToRoleDto = exports.RolePermissionPaginationDto = exports.UpdateRolePermissionDto = exports.CreateRolePermissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../../shared/common/dtos/pagination.dto");
class CreateRolePermissionDto {
    role_id;
    permission_code;
    is_active;
}
exports.CreateRolePermissionDto = CreateRolePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Role ID',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateRolePermissionDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'CREATE_ORDER',
        description: 'Permission code',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRolePermissionDto.prototype, "permission_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Indicates if the permission is active for this role',
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRolePermissionDto.prototype, "is_active", void 0);
class UpdateRolePermissionDto {
    role_id;
    permission_code;
    is_active;
}
exports.UpdateRolePermissionDto = UpdateRolePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Role ID',
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateRolePermissionDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'CREATE_ORDER',
        description: 'Permission code',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRolePermissionDto.prototype, "permission_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Indicates if the permission is active for this role',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRolePermissionDto.prototype, "is_active", void 0);
class RolePermissionPaginationDto extends pagination_dto_1.PaginationDto {
    role_id;
    permission_code;
}
exports.RolePermissionPaginationDto = RolePermissionPaginationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Filter by role ID',
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RolePermissionPaginationDto.prototype, "role_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'CREATE_ORDER',
        description: 'Filter by permission code',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RolePermissionPaginationDto.prototype, "permission_code", void 0);
class AssignPermissionsToRoleDto {
    permission_ids;
}
exports.AssignPermissionsToRoleDto = AssignPermissionsToRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [1, 2, 3],
        description: 'Permission IDs to assign to the role',
        type: [Number],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], AssignPermissionsToRoleDto.prototype, "permission_ids", void 0);
//# sourceMappingURL=role-permission.dto.js.map