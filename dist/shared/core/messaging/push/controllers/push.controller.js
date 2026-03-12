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
exports.PushController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const push_service_1 = require("../services/push.service");
const role_guard_1 = require("../../../auth/guards/role.guard");
const push_dtos_1 = require("../dtos/push-dtos");
let PushController = class PushController {
    pushService;
    constructor(pushService) {
        this.pushService = pushService;
    }
    async send(dto) {
        try {
            const message = {
                ...dto,
                scheduleFor: dto.scheduleFor ? new Date(dto.scheduleFor) : undefined,
            };
            if (message.recipient.type === 'player_id' && !message.recipient.value) {
                throw new Error('Se requiere un ID de jugador para notificaciones de tipo player_id');
            }
            return await this.pushService.send(message);
        }
        catch (error) {
            console.error('Error en el controlador de push:', error);
            throw error;
        }
    }
    async sendBulk(dto) {
        const messages = dto.messages.map((msg) => ({
            ...msg,
            scheduleFor: msg.scheduleFor ? new Date(msg.scheduleFor) : undefined,
        }));
        return await this.pushService.sendBulk(messages);
    }
};
exports.PushController = PushController;
__decorate([
    (0, common_1.Post)('send'),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar una notificación push' }),
    (0, swagger_1.ApiBody)({ type: push_dtos_1.SendPushDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notificación push enviada correctamente',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [push_dtos_1.SendPushDto]),
    __metadata("design:returntype", Promise)
], PushController.prototype, "send", null);
__decorate([
    (0, common_1.Post)('send-bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar múltiples notificaciones push' }),
    (0, swagger_1.ApiBody)({ type: push_dtos_1.SendBulkPushDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notificaciones push enviadas correctamente',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Parámetros inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [push_dtos_1.SendBulkPushDto]),
    __metadata("design:returntype", Promise)
], PushController.prototype, "sendBulk", null);
exports.PushController = PushController = __decorate([
    (0, swagger_1.ApiTags)('08 - Push Notifications'),
    (0, common_1.Controller)('api/messaging/push'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [push_service_1.PushService])
], PushController);
//# sourceMappingURL=push.controller.js.map