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
exports.BulkDeleteActionDto = exports.UpdateActionDto = exports.CreateActionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateActionDto {
    description;
    slug;
}
exports.CreateActionDto = CreateActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Permite crear nuevos registros',
        description: 'Descripción de la acción',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'create',
        description: 'Slug único de la acción',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateActionDto.prototype, "slug", void 0);
class UpdateActionDto {
    description;
    slug;
}
exports.UpdateActionDto = UpdateActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Permite actualizar registros existentes',
        description: 'Descripción de la acción',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateActionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'update',
        description: 'Slug único de la acción',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateActionDto.prototype, "slug", void 0);
class BulkDeleteActionDto {
    ids;
}
exports.BulkDeleteActionDto = BulkDeleteActionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [1, 2, 3],
        description: 'Array de IDs de acciones a eliminar',
        type: [Number],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BulkDeleteActionDto.prototype, "ids", void 0);
//# sourceMappingURL=action.dto.js.map