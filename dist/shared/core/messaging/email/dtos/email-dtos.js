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
exports.SendTemplateEmailDto = exports.SendBulkEmailDto = exports.SendEmailDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SendEmailDto {
    to;
    subject;
    html;
    text;
    attachments;
}
exports.SendEmailDto = SendEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destinatario(s) del correo',
        example: 'destinatario@ejemplo.com o ["destinatario1@ejemplo.com", "destinatario2@ejemplo.com"]',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        return typeof value === 'string' ? [value] : value;
    }),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Object)
], SendEmailDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asunto del correo',
        example: 'Bienvenido a nuestra plataforma',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contenido HTML del correo',
        example: '<h1>Bienvenido</h1><p>Gracias por registrarte</p>',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "html", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contenido de texto plano (alternativa para clientes sin HTML)',
        example: 'Bienvenido. Gracias por registrarte.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Archivos adjuntos',
        example: [{ filename: 'manual.pdf', content: 'Base64...' }],
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendEmailDto.prototype, "attachments", void 0);
class SendBulkEmailDto {
    messages;
}
exports.SendBulkEmailDto = SendBulkEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de correos a enviar',
        type: [SendEmailDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], SendBulkEmailDto.prototype, "messages", void 0);
class SendTemplateEmailDto {
    to;
    subject;
    templateName;
    templateData;
    attachments;
}
exports.SendTemplateEmailDto = SendTemplateEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Destinatario(s) del correo',
        example: 'destinatario@ejemplo.com o ["destinatario1@ejemplo.com", "destinatario2@ejemplo.com"]',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        return typeof value === 'string' ? [value] : value;
    }),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Object)
], SendTemplateEmailDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Asunto del correo',
        example: 'Bienvenido a nuestra plataforma',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendTemplateEmailDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la plantilla HTML a usar',
        example: 'welcome',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendTemplateEmailDto.prototype, "templateName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Datos para reemplazar las variables en la plantilla',
        example: {
            userName: 'Juan Pérez',
            actionUrl: 'https://ejemplo.com/activar',
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], SendTemplateEmailDto.prototype, "templateData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Archivos adjuntos',
        example: [{ filename: 'manual.pdf', content: 'Base64...' }],
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], SendTemplateEmailDto.prototype, "attachments", void 0);
//# sourceMappingURL=email-dtos.js.map