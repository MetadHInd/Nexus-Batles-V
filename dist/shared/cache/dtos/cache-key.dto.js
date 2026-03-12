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
exports.CacheStatsDto = exports.ClearCachePatternDto = exports.SetCacheDto = exports.CachePatternDto = exports.CacheKeyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CacheKeyDto {
    key;
}
exports.CacheKeyDto = CacheKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clave de cache a buscar',
        example: 'user_id_1'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CacheKeyDto.prototype, "key", void 0);
class CachePatternDto {
    pattern;
}
exports.CachePatternDto = CachePatternDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Patrón de búsqueda (soporta wildcards *)',
        example: 'user_*'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CachePatternDto.prototype, "pattern", void 0);
class SetCacheDto {
    key;
    value;
    ttl;
}
exports.SetCacheDto = SetCacheDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Clave del cache',
        example: 'test_key'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetCacheDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor a guardar (será serializado a JSON)',
        example: { data: 'test value' }
    }),
    __metadata("design:type", Object)
], SetCacheDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tiempo de expiración en segundos (opcional)',
        example: 3600
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SetCacheDto.prototype, "ttl", void 0);
class ClearCachePatternDto {
    pattern;
    paginationOnly;
}
exports.ClearCachePatternDto = ClearCachePatternDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Patrón específico a limpiar (opcional, si no se provee limpia todo)',
        example: 'users_*'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClearCachePatternDto.prototype, "pattern", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Solo limpiar caches de paginación',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ClearCachePatternDto.prototype, "paginationOnly", void 0);
class CacheStatsDto {
    totalKeys;
    memoryUsage;
    connected;
    serverInfo;
}
exports.CacheStatsDto = CacheStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de claves en cache' }),
    __metadata("design:type", Number)
], CacheStatsDto.prototype, "totalKeys", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Uso de memoria estimado (bytes)' }),
    __metadata("design:type", Number)
], CacheStatsDto.prototype, "memoryUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado de conexión con Redis' }),
    __metadata("design:type", Boolean)
], CacheStatsDto.prototype, "connected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Información del servidor Redis' }),
    __metadata("design:type", Object)
], CacheStatsDto.prototype, "serverInfo", void 0);
//# sourceMappingURL=cache-key.dto.js.map