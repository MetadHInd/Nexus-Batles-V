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
exports.CacheKeysResponseDto = exports.GetCacheKeysDto = exports.ClearCacheResponseDto = exports.ClearModuleCacheDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ClearModuleCacheDto {
    modules;
    tenantId;
    clearAll;
    customPattern;
}
exports.ClearModuleCacheDto = ClearModuleCacheDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lista de módulos para limpiar su caché',
        example: ['order', 'customer', 'menu'],
        isArray: true,
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ClearModuleCacheDto.prototype, "modules", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant ID específico para limpiar caché (si no se proporciona, limpia del tenant actual)',
        example: 'aiabase',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClearModuleCacheDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Limpiar todo el caché (ignora módulos específicos)',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ClearModuleCacheDto.prototype, "clearAll", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pattern personalizado para limpiar (formato: tenant:namespace:pattern)',
        example: '*:order:*',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClearModuleCacheDto.prototype, "customPattern", void 0);
class ClearCacheResponseDto {
    success;
    message;
    keysDeleted;
    details;
    tenantId;
}
exports.ClearCacheResponseDto = ClearCacheResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la operación fue exitosa',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ClearCacheResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mensaje descriptivo del resultado',
        example: 'Caché limpiado exitosamente para 3 módulos',
    }),
    __metadata("design:type", String)
], ClearCacheResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de claves eliminadas',
        example: 45,
    }),
    __metadata("design:type", Number)
], ClearCacheResponseDto.prototype, "keysDeleted", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Detalles de los módulos limpiados',
        example: {
            order: 15,
            customer: 20,
            menu: 10,
        },
    }),
    __metadata("design:type", Object)
], ClearCacheResponseDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant ID usado para la operación',
        example: 'aiabase',
    }),
    __metadata("design:type", String)
], ClearCacheResponseDto.prototype, "tenantId", void 0);
class GetCacheKeysDto {
    pattern;
    tenantId;
    module;
}
exports.GetCacheKeysDto = GetCacheKeysDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Pattern para buscar claves (formato Redis)',
        example: '*:order:*',
        default: '*',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetCacheKeysDto.prototype, "pattern", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant ID específico (si no se proporciona, usa el tenant actual)',
        example: 'aiabase',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetCacheKeysDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Módulo específico para filtrar',
        example: 'order',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetCacheKeysDto.prototype, "module", void 0);
class CacheKeysResponseDto {
    success;
    totalKeys;
    keys;
    groupedByModule;
}
exports.CacheKeysResponseDto = CacheKeysResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la operación fue exitosa',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CacheKeysResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total de claves encontradas',
        example: 125,
    }),
    __metadata("design:type", Number)
], CacheKeysResponseDto.prototype, "totalKeys", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de claves encontradas',
        example: ['galatea:order:findAll', 'galatea:customer:findById:id=123'],
        isArray: true,
    }),
    __metadata("design:type", Array)
], CacheKeysResponseDto.prototype, "keys", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Claves agrupadas por módulo',
        example: {
            order: 45,
            customer: 50,
            menu: 30,
        },
    }),
    __metadata("design:type", Object)
], CacheKeysResponseDto.prototype, "groupedByModule", void 0);
//# sourceMappingURL=clear-cache.dto.js.map