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
var GmailAutomationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailAutomationController = exports.CreateActionDto = exports.CreateFilterDto = exports.UpdateConfigDto = exports.RegisterUserDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gmail_automation_service_1 = require("./gmail-automation.service");
class RegisterUserDto {
    userId;
    accessToken;
    refreshToken;
    filters;
    actions;
}
exports.RegisterUserDto = RegisterUserDto;
class UpdateConfigDto {
    filters;
    actions;
}
exports.UpdateConfigDto = UpdateConfigDto;
class CreateFilterDto {
    name;
    query;
    enabled = true;
}
exports.CreateFilterDto = CreateFilterDto;
class CreateActionDto {
    name;
    type;
    config;
    enabled = true;
}
exports.CreateActionDto = CreateActionDto;
let GmailAutomationController = GmailAutomationController_1 = class GmailAutomationController {
    automationService;
    logger = new common_1.Logger(GmailAutomationController_1.name);
    constructor(automationService) {
        this.automationService = automationService;
    }
    async registerUser(registerDto) {
        try {
            await this.automationService.registerUser({
                userId: registerDto.userId,
                accessToken: registerDto.accessToken,
                refreshToken: registerDto.refreshToken,
                filters: registerDto.filters || [],
                actions: registerDto.actions || []
            });
            return {
                success: true,
                message: `Usuario ${registerDto.userId} registrado para monitoreo automático`
            };
        }
        catch (error) {
            this.logger.error(`Error registrando usuario ${registerDto.userId}:`, error);
            throw new common_1.HttpException(error.message || 'Error registrando usuario', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async unregisterUser(userId) {
        try {
            await this.automationService.unregisterUser(userId);
            return {
                success: true,
                message: `Usuario ${userId} desregistrado del monitoreo`
            };
        }
        catch (error) {
            this.logger.error(`Error desregistrando usuario ${userId}:`, error);
            throw new common_1.HttpException(error.message || 'Error desregistrando usuario', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async testUserConfig(userId) {
        try {
            await this.automationService.processUserEmailsManually(userId);
            return {
                success: true,
                message: `Configuración probada para usuario ${userId}`,
                results: {
                    message: 'Procesamiento manual completado. Revisa los logs para ver los resultados.'
                }
            };
        }
        catch (error) {
            this.logger.error(`Error probando configuración para usuario ${userId}:`, error);
            throw new common_1.HttpException(error.message || 'Error probando configuración', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async forceCheck() {
        try {
            await this.automationService.forceCheck();
            return {
                success: true,
                message: 'Verificación manual ejecutada para todos los usuarios activos'
            };
        }
        catch (error) {
            this.logger.error('Error en verificación forzada:', error);
            throw new common_1.HttpException(error.message || 'Error en verificación forzada', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getServiceStatus() {
        return {
            status: 'active',
            message: 'Servicio de automatización Gmail activo',
            lastCheck: new Date(),
            intervalMs: 30000,
            info: 'El servicio verifica correos nuevos cada 30 segundos automáticamente'
        };
    }
    async setupSimpleLogging(body) {
        try {
            const simpleConfig = {
                userId: body.userId,
                accessToken: body.accessToken,
                refreshToken: body.refreshToken,
                filters: [],
                actions: []
            };
            await this.automationService.registerUser(simpleConfig);
            return {
                success: true,
                message: 'Automatización simple configurada. Todos los correos nuevos se registrarán en los logs.',
                config: simpleConfig
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error configurando automatización simple', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setupSupportAutomation(body) {
        try {
            const supportConfig = {
                userId: body.userId,
                accessToken: body.accessToken,
                refreshToken: body.refreshToken,
                filters: [
                    {
                        name: 'Correos de soporte',
                        query: 'to:support@galatealabs.ai OR subject:(help OR support OR problema OR issue)',
                        enabled: true
                    }
                ],
                actions: [
                    {
                        name: 'Crear ticket de soporte',
                        type: 'function',
                        config: { functionName: 'processSupport' },
                        enabled: true
                    },
                    {
                        name: 'Notificar equipo',
                        type: 'notification',
                        config: { type: 'slack', channel: '#support' },
                        enabled: true
                    }
                ]
            };
            await this.automationService.registerUser(supportConfig);
            return {
                success: true,
                message: 'Automatización de soporte configurada exitosamente',
                config: supportConfig
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error configurando automatización de soporte', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.GmailAutomationController = GmailAutomationController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar usuario para monitoreo automático de correos' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterUserDto]),
    __metadata("design:returntype", Promise)
], GmailAutomationController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Delete)('users/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Desregistrar usuario del monitoreo automático' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario desregistrado exitosamente' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GmailAutomationController.prototype, "unregisterUser", null);
__decorate([
    (0, common_1.Post)('users/:userId/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Probar configuración de usuario procesando correos manualmente' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prueba ejecutada exitosamente' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GmailAutomationController.prototype, "testUserConfig", null);
__decorate([
    (0, common_1.Post)('force-check'),
    (0, swagger_1.ApiOperation)({ summary: 'Forzar verificación manual de todos los usuarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verificación forzada exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GmailAutomationController.prototype, "forceCheck", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estado del servicio de automatización' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado del servicio obtenido exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GmailAutomationController.prototype, "getServiceStatus", null);
__decorate([
    (0, common_1.Post)('examples/setup-simple-logging'),
    (0, swagger_1.ApiOperation)({ summary: 'Configurar automatización simple que solo registra correos nuevos' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Automatización simple configurada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GmailAutomationController.prototype, "setupSimpleLogging", null);
__decorate([
    (0, common_1.Post)('examples/setup-support-automation'),
    (0, swagger_1.ApiOperation)({ summary: 'Configurar automatización de ejemplo para correos de soporte' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Automatización de soporte configurada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GmailAutomationController.prototype, "setupSupportAutomation", null);
exports.GmailAutomationController = GmailAutomationController = GmailAutomationController_1 = __decorate([
    (0, swagger_1.ApiTags)('15 - Gmail Automation'),
    (0, common_1.Controller)('gmail/automation'),
    __metadata("design:paramtypes", [gmail_automation_service_1.GmailAutomationService])
], GmailAutomationController);
//# sourceMappingURL=gmail-automation.controller.js.map