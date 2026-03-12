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
exports.MessagingStrategyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const messaging_strategy_manager_service_1 = require("../messaging-strategy-manager.service");
let MessagingStrategyController = class MessagingStrategyController {
    strategyManager;
    constructor(strategyManager) {
        this.strategyManager = strategyManager;
    }
    listStrategies() {
        return {
            strategies: this.strategyManager.listStrategies(),
        };
    }
    async getServiceConfig(serviceId) {
        const config = await this.strategyManager.getServiceConfig(serviceId);
        return {
            success: !!config,
            config,
        };
    }
    async getPhoneNumber(serviceId) {
        const phoneNumber = await this.strategyManager.getPhoneNumber(serviceId);
        return {
            success: !!phoneNumber,
            phoneNumber,
        };
    }
    async sendSms(body) {
        const result = await this.strategyManager.sendSms(body.message, body.serviceId || 'default');
        return result;
    }
    async sendWhatsApp(body) {
        const result = await this.strategyManager.sendWhatsApp(body.message, body.serviceId || 'default');
        return result;
    }
    health() {
        return {
            status: 'ok',
            strategies: this.strategyManager.listStrategies(),
            timestamp: new Date().toISOString(),
        };
    }
};
exports.MessagingStrategyController = MessagingStrategyController;
__decorate([
    (0, common_1.Get)('strategies'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar estrategias disponibles',
        description: 'Retorna todas las estrategias de mensajería configuradas'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de estrategias obtenida exitosamente',
        schema: {
            type: 'object',
            properties: {
                strategies: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['twilio', 'aws-sns', 'custom']
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MessagingStrategyController.prototype, "listStrategies", null);
__decorate([
    (0, common_1.Get)('service/:serviceId/config'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener configuración de servicio',
        description: 'Retorna la configuración del servicio de mensajería especificado'
    }),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'ID del servicio', example: 'default' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Configuración obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Servicio no encontrado' }),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingStrategyController.prototype, "getServiceConfig", null);
__decorate([
    (0, common_1.Get)('service/:serviceId/phone'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener número de teléfono de servicio',
        description: 'Retorna el número de teléfono asociado al servicio'
    }),
    (0, swagger_1.ApiParam)({ name: 'serviceId', description: 'ID del servicio', example: 'default' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Número de teléfono obtenido exitosamente' }),
    __param(0, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingStrategyController.prototype, "getPhoneNumber", null);
__decorate([
    (0, common_1.Post)('sms/send'),
    (0, swagger_1.ApiOperation)({
        summary: 'Enviar SMS usando estrategia',
        description: 'Envía un mensaje SMS utilizando la estrategia configurada'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SMS enviado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al enviar SMS' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingStrategyController.prototype, "sendSms", null);
__decorate([
    (0, common_1.Post)('whatsapp/send'),
    (0, swagger_1.ApiOperation)({
        summary: 'Enviar WhatsApp usando estrategia',
        description: 'Envía un mensaje de WhatsApp utilizando la estrategia configurada'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'WhatsApp enviado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error al enviar WhatsApp' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingStrategyController.prototype, "sendWhatsApp", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check del sistema de estrategias',
        description: 'Verifica el estado del sistema de estrategias de mensajería'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sistema operativo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MessagingStrategyController.prototype, "health", null);
exports.MessagingStrategyController = MessagingStrategyController = __decorate([
    (0, swagger_1.ApiTags)('04 - Messaging Strategy'),
    (0, common_1.Controller)('messaging-strategy'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [messaging_strategy_manager_service_1.MessagingStrategyManager])
], MessagingStrategyController);
//# sourceMappingURL=messaging-strategy.controller.js.map