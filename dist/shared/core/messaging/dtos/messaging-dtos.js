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
exports.SendMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SendMessageDto {
    channel;
    providerName;
    recipient;
    content;
    options;
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Canal de envío del mensaje',
        enum: ['email', 'push', 'sms'],
        example: 'email',
    }),
    (0, class_validator_1.IsEnum)(['email', 'push', 'sms']),
    __metadata("design:type", String)
], SendMessageDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nombre del proveedor específico a utilizar',
        example: 'onesignal, twilio, smtp',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "providerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destinatario(s) del mensaje. Para email/sms puede ser un string o array, para push debe seguir el formato específico',
        example: 'recipient@example.com o {type: "player_id", value: "xxxx"}',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], SendMessageDto.prototype, "recipient", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contenido del mensaje (varía según el canal)',
        example: {
            subject: 'Asunto (para email)',
            html: '<p>Contenido HTML</p> (para email)',
            title: 'Título de notificación (para push)',
            body: 'Cuerpo del mensaje (para push/sms)',
            text: 'Texto del SMS (para sms)',
        },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Opciones adicionales según el canal',
        example: {
            scheduleFor: '2025-05-01T12:00:00Z',
            ttl: 86400,
            priority: 'high',
            silent: false,
            from: '+12025550142',
            attachments: [{ filename: 'doc.pdf', content: 'base64data' }],
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SendMessageDto.prototype, "options", void 0);
//# sourceMappingURL=messaging-dtos.js.map