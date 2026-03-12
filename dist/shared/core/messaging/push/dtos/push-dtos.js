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
exports.SendBulkPushDto = exports.SendPushDto = exports.PushContentDto = exports.PushRecipientDto = exports.PushButtonDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PushButtonDto {
    id;
    text;
    url;
}
exports.PushButtonDto = PushButtonDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del botón',
        example: 'btn_1',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PushButtonDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Texto a mostrar en el botón',
        example: 'Ver detalles',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PushButtonDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL a la que dirige el botón',
        example: 'https://ejemplo.com/detalles',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PushButtonDto.prototype, "url", void 0);
class PushRecipientDto {
    type;
    value;
}
exports.PushRecipientDto = PushRecipientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de destinatario',
        enum: ['player_id', 'segment', 'all', 'topic'],
        example: 'player_id',
    }),
    (0, class_validator_1.IsEnum)(['player_id', 'segment', 'all', 'topic']),
    __metadata("design:type", String)
], PushRecipientDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID o IDs de destinatarios (depende del tipo)',
        example: 'e4e87830-b954-11e3-811d-f3b376925f15',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PushRecipientDto.prototype, "value", void 0);
class PushContentDto {
    title;
    body;
    imageUrl;
    url;
    data;
    buttons;
}
exports.PushContentDto = PushContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Título de la notificación',
        example: 'Nueva actualización disponible',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PushContentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cuerpo del mensaje',
        example: 'Hemos lanzado nuevas funcionalidades. ¡Actualiza ahora!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PushContentDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL de imagen para mostrar en la notificación',
        example: 'https://ejemplo.com/imagen.jpg',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PushContentDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL para abrir al hacer clic en la notificación',
        example: 'https://ejemplo.com/nueva-version',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PushContentDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Datos adicionales para enviar con la notificación',
        example: { action: 'update', version: '2.0' },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PushContentDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Botones de acción para la notificación',
        type: [PushButtonDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PushButtonDto),
    __metadata("design:type", Array)
], PushContentDto.prototype, "buttons", void 0);
class SendPushDto {
    recipient;
    content;
    scheduleFor;
    ttl;
    priority;
    silent;
    collapseId;
    channelId;
}
exports.SendPushDto = SendPushDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información del destinatario',
        type: PushRecipientDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PushRecipientDto),
    __metadata("design:type", PushRecipientDto)
], SendPushDto.prototype, "recipient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contenido de la notificación',
        type: PushContentDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PushContentDto),
    __metadata("design:type", PushContentDto)
], SendPushDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fecha para programar el envío (formato ISO)',
        example: '2025-05-01T12:00:00Z',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendPushDto.prototype, "scheduleFor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tiempo de vida en segundos',
        example: 86400,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], SendPushDto.prototype, "ttl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Prioridad de la notificación',
        enum: ['high', 'normal'],
        example: 'high',
    }),
    (0, class_validator_1.IsEnum)(['high', 'normal']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendPushDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Si es true, no muestra la notificación visualmente',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SendPushDto.prototype, "silent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID de colapso para agrupar notificaciones',
        example: 'update-notification',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendPushDto.prototype, "collapseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID del canal para Android',
        example: 'updates_channel',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendPushDto.prototype, "channelId", void 0);
class SendBulkPushDto {
    messages;
}
exports.SendBulkPushDto = SendBulkPushDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de notificaciones a enviar',
        type: [SendPushDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SendPushDto),
    __metadata("design:type", Array)
], SendBulkPushDto.prototype, "messages", void 0);
//# sourceMappingURL=push-dtos.js.map