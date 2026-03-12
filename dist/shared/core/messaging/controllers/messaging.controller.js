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
exports.MessagingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const role_guard_1 = require("../../auth/guards/role.guard");
const roles_enum_1 = require("../../auth/constants/roles.enum");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const messaging_provider_factory_1 = require("../utils/messaging-provider.factory");
const messaging_dtos_1 = require("../dtos/messaging-dtos");
let MessagingController = class MessagingController {
    messagingFactory;
    constructor(messagingFactory) {
        this.messagingFactory = messagingFactory;
    }
    async send(dto) {
        let providerType;
        switch (dto.channel) {
            case 'email':
                providerType = messaging_provider_factory_1.MessagingProvider.EMAIL;
                break;
            case 'push':
                providerType = messaging_provider_factory_1.MessagingProvider.PUSH;
                break;
            case 'sms':
                providerType = messaging_provider_factory_1.MessagingProvider.SMS;
                break;
            default:
                throw new Error(`Canal no soportado: ${dto.channel}`);
        }
        const service = this.messagingFactory.getProvider(providerType);
        let message;
        switch (providerType) {
            case messaging_provider_factory_1.MessagingProvider.EMAIL:
                message = {
                    to: dto.recipient,
                    subject: dto.content.subject,
                    html: dto.content.html,
                    text: dto.content.text,
                    attachments: dto.content.attachments,
                };
                break;
            case messaging_provider_factory_1.MessagingProvider.PUSH:
                message = {
                    recipient: {
                        type: dto.recipient.type || 'player_id',
                        value: dto.recipient.value,
                    },
                    content: {
                        title: dto.content.title,
                        body: dto.content.body,
                        imageUrl: dto.content.imageUrl,
                        url: dto.content.url,
                        data: dto.content.data,
                        buttons: dto.content.buttons,
                    },
                    scheduleFor: dto.options?.scheduleFor
                        ? new Date(dto.options.scheduleFor)
                        : undefined,
                    ttl: dto.options?.ttl,
                    priority: dto.options?.priority,
                    silent: dto.options?.silent,
                    collapseId: dto.options?.collapseId,
                    channelId: dto.options?.channelId,
                };
                break;
            case messaging_provider_factory_1.MessagingProvider.SMS:
                message = {
                    to: dto.recipient,
                    text: dto.content.text,
                    from: dto.options?.from,
                    name: dto.content.name,
                    mediaUrls: dto.content.mediaUrls,
                    includedSegments: dto.content.includedSegments,
                    scheduleFor: dto.options?.scheduleFor
                        ? new Date(dto.options.scheduleFor)
                        : undefined,
                    validityPeriod: dto.options?.validityPeriod,
                    reference: dto.options?.reference,
                };
                break;
        }
        return await service.send(message);
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Post)('send'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPERVISOR),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar un mensaje por cualquier canal' }),
    (0, swagger_1.ApiBody)({ type: messaging_dtos_1.SendMessageDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mensaje enviado correctamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [messaging_dtos_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "send", null);
exports.MessagingController = MessagingController = __decorate([
    (0, swagger_1.ApiTags)('08 - Messaging - General'),
    (0, common_1.Controller)('api/messaging'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [messaging_provider_factory_1.MessagingProviderFactory])
], MessagingController);
//# sourceMappingURL=messaging.controller.js.map