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
exports.ConfigurableMessagingDto = exports.MessagingConfigDto = exports.BaseMessagingDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BaseMessagingDto {
    messageId;
    tenantId;
    metadata;
}
exports.BaseMessagingDto = BaseMessagingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identificador único para seguimiento del mensaje (opcional)',
        example: 'msg-12345',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseMessagingDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identificador del tenant/cliente (permite multitenancy)',
        example: 'tenant-001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BaseMessagingDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metadatos adicionales para propósitos de tracking',
        example: { campaign: 'welcome', source: 'web' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BaseMessagingDto.prototype, "metadata", void 0);
class MessagingConfigDto {
    logDelivery;
    retryOnFailure;
    maxRetries;
    retryDelay;
}
exports.MessagingConfigDto = MessagingConfigDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Si es true, se guarda un registro del envío en la base de datos',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MessagingConfigDto.prototype, "logDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Si es true, se reintenta el envío en caso de error',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MessagingConfigDto.prototype, "retryOnFailure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Número máximo de reintentos',
        default: 3,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MessagingConfigDto.prototype, "maxRetries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tiempo a esperar para el reintento (en segundos)',
        default: 60,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MessagingConfigDto.prototype, "retryDelay", void 0);
class ConfigurableMessagingDto extends BaseMessagingDto {
    config;
}
exports.ConfigurableMessagingDto = ConfigurableMessagingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Configuración adicional del mensaje',
        type: () => MessagingConfigDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MessagingConfigDto),
    __metadata("design:type", MessagingConfigDto)
], ConfigurableMessagingDto.prototype, "config", void 0);
//# sourceMappingURL=base-messaging.dto.js.map