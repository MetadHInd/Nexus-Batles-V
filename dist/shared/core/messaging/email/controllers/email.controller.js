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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const email_service_1 = require("../services/email.service");
const email_template_service_1 = require("../services/email-template.service");
const role_guard_1 = require("../../../auth/guards/role.guard");
const email_dtos_1 = require("../dtos/email-dtos");
let EmailController = class EmailController {
    emailService;
    templateService;
    constructor(emailService, templateService) {
        this.emailService = emailService;
        this.templateService = templateService;
    }
    async send(dto) {
        const message = dto;
        return await this.emailService.send(message);
    }
    async sendBulk(dto) {
        const results = [];
        for (const message of dto.messages) {
            results.push(await this.emailService.send(message));
        }
        return results;
    }
    async sendTemplate(dto) {
        const html = await this.templateService.render(dto.templateName, dto.templateData);
        const message = {
            to: dto.to,
            subject: dto.subject,
            html,
            attachments: dto.attachments,
        };
        return await this.emailService.send(message);
    }
};
exports.EmailController = EmailController;
__decorate([
    (0, common_1.Post)('send'),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar un email' }),
    (0, swagger_1.ApiBody)({ type: email_dtos_1.SendEmailDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email enviado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dtos_1.SendEmailDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "send", null);
__decorate([
    (0, common_1.Post)('send-bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar múltiples emails' }),
    (0, swagger_1.ApiBody)({ type: email_dtos_1.SendBulkEmailDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emails enviados correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dtos_1.SendBulkEmailDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendBulk", null);
__decorate([
    (0, common_1.Post)('send-template'),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar un email usando una plantilla' }),
    (0, swagger_1.ApiBody)({ type: email_dtos_1.SendTemplateEmailDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Email con plantilla enviado correctamente',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dtos_1.SendTemplateEmailDto]),
    __metadata("design:returntype", Promise)
], EmailController.prototype, "sendTemplate", null);
exports.EmailController = EmailController = __decorate([
    (0, swagger_1.ApiTags)('05 - Email'),
    (0, common_1.Controller)('api/messaging/email'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [email_service_1.EmailService,
        email_template_service_1.EmailTemplateService])
], EmailController);
//# sourceMappingURL=email.controller.js.map