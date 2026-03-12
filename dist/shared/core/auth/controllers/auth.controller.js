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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("../dtos/login.dto");
const register_dto_1 = require("../dtos/register.dto");
const reset_password_dto_1 = require("../dtos/reset-password.dto");
const activation_dto_1 = require("../dtos/activation.dto");
const auth_service_1 = require("../services/internal/auth.service");
const auth_service_2 = require("../services/external/auth.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const token_service_1 = require("../services/shared/token.service");
const error_factory_1 = require("../../../errors/error.factory");
const error_codes_enum_1 = require("../../../errors/error-codes.enum");
const sse_connection_manager_service_1 = require("../../sse/services/sse-connection-manager.service");
const user_public_mapper_1 = require("../mappers/user-public.mapper");
let AuthController = class AuthController {
    internalAuth;
    externalAuth;
    tokenService;
    sseConnectionManager;
    constructor(internalAuth, externalAuth, tokenService, sseConnectionManager) {
        this.internalAuth = internalAuth;
        this.externalAuth = externalAuth;
        this.tokenService = tokenService;
        this.sseConnectionManager = sseConnectionManager;
    }
    async register(dto) {
        return this.internalAuth.register(dto);
    }
    async activateAccount(dto) {
        return this.internalAuth.activateAccount(dto);
    }
    async resendActivation(dto) {
        return this.internalAuth.resendActivation(dto);
    }
    async requestResetPassword(dto) {
        return this.internalAuth.requestResetPassword(dto);
    }
    async resetPassword(dto) {
        return this.internalAuth.resetPassword(dto);
    }
    async getUserByUuid(uuid) {
        const user = await this.internalAuth.getSysuserByUuid(uuid);
        if (!user) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                message: 'User not found',
            });
        }
        return user_public_mapper_1.UserPublicMapper.toPublic(user);
    }
    async login(dto, response) {
        const result = process.env.AUTH_EXTERNAL === 'true'
            ? await this.externalAuth.login(dto)
            : await this.internalAuth.login(dto);
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        };
        response.cookie('auth_token', result.token, cookieOptions);
        response.cookie('jwt', result.token, cookieOptions);
        return result;
    }
    async loginSwagger(dto, response) {
        const result = process.env.AUTH_EXTERNAL === 'true'
            ? await this.externalAuth.login(dto)
            : await this.internalAuth.login(dto);
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        };
        response.cookie('auth_token', result.token, cookieOptions);
        response.cookie('jwt', result.token, cookieOptions);
        return result;
    }
    async debugAuth(req) {
        console.log('\n🔍 [Debug] Headers:', req.headers);
        console.log('🔍 [Debug] Cookies:', req.cookies);
        return {
            headers: {
                authorization: req.headers.authorization || 'Not present',
                cookie: req.headers.cookie || 'Not present',
                userAgent: req.headers['user-agent'] || 'Not present',
            },
            cookies: req.cookies || 'No cookies found',
            cookieNames: req.cookies ? Object.keys(req.cookies) : [],
            timestamp: new Date().toISOString(),
        };
    }
    async getProfile(req) {
        return {
            message: 'JWT funcionando correctamente',
            user: req.user,
            timestamp: new Date().toISOString(),
        };
    }
    async testLogin() {
        try {
            const loginDto = {
                email: 'manuel@galatealabs.ai',
                password: 'password123',
            };
            const result = await this.internalAuth.login(loginDto);
            return {
                message: 'Token generado exitosamente',
                token: result.token,
                howToUse: {
                    step1: 'Copia el token de arriba',
                    step2: 'Ve al endpoint /api/sysUser/test-jwt',
                    step3: 'Haz clic en el botón "Authorize" (🔒) en la parte superior',
                    step4: 'Pega: Bearer [token-copiado]',
                    step5: 'Haz clic en "Authorize"',
                    step6: 'Ahora ejecuta /api/sysUser/test-jwt',
                },
                swagger_access: {
                    url: '/api-docs?token=' + result.token,
                    instructions: 'También puedes usar este enlace para acceder directamente a Swagger',
                },
            };
        }
        catch (error) {
            return {
                error: 'Error en login',
                details: error.message,
            };
        }
    }
    async testJwt(req) {
        return {
            message: '¡JWT está funcionando perfectamente!',
            authStrategy: 'jwt',
            user: req.user,
            serverTime: new Date().toISOString(),
        };
    }
    async getRestaurants(headers) {
        try {
            const authHeader = headers['authorization'];
            console.log('🔍 [getRestaurants] Auth header:', authHeader ? 'Present' : 'Missing');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new Error('Token not found');
            }
            const token = authHeader.replace('Bearer ', '');
            const decoded = await this.tokenService.validateToken(token);
            console.log('🔓 [getRestaurants] Token decoded:', !!decoded);
            console.log('🏪 [getRestaurants] Restaurants in token:', decoded.restaurants?.length || 0);
            if (!decoded.restaurants || !Array.isArray(decoded.restaurants)) {
                console.log('❌ [getRestaurants] No restaurants array found in token');
                throw new Error('No restaurants found in token');
            }
            const response = {
                hasMultipleRestaurants: decoded.restaurants.length > 1,
                restaurants: decoded.restaurants,
            };
            console.log('✅ [getRestaurants] Returning response:', response);
            return response;
        }
        catch (error) {
            console.error('❌ [getRestaurants] Error:', error.message);
            throw new Error('Invalid token or no restaurants available');
        }
    }
    async selectRestaurant(headers, body) {
        try {
            const authHeader = headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new Error('Token not found');
            }
            const token = authHeader.replace('Bearer ', '');
            const decoded = await this.tokenService.validateToken(token);
            if (!decoded.restaurants || !Array.isArray(decoded.restaurants)) {
                throw new Error('No restaurants found in token');
            }
            const selectedRestaurant = decoded.restaurants.find(restaurant => restaurant.uuid === body.restaurantUuid);
            if (!selectedRestaurant) {
                throw new Error('Restaurant not found');
            }
            return {
                success: true,
                selectedRestaurant,
                instructions: {
                    message: 'Para usar este restaurante en todas las peticiones, agrega el header "restaurantSub" con el UUID del restaurante',
                    headerName: 'restaurantSub',
                    headerValue: selectedRestaurant.uuid
                }
            };
        }
        catch (error) {
            throw new Error('Invalid token or restaurant not available');
        }
    }
    async getMyTenants(req) {
        const userId = req.user.id;
        const userTenants = await this.internalAuth['prisma'].user_tenants.findMany({
            where: {
                user_id: userId,
                is_active: true,
            },
            include: {
                tenants: {
                    select: {
                        tenant_sub: true,
                        slug: true,
                        name: true,
                        is_active: true,
                    },
                },
            },
            orderBy: {
                is_default: 'desc',
            },
        });
        const tenants = userTenants
            .filter(ut => ut.tenants.is_active)
            .map(ut => ({
            tenant_sub: ut.tenants.tenant_sub,
            slug: ut.tenants.slug,
            name: ut.tenants.name,
            is_default: ut.is_default,
        }));
        return { tenants };
    }
    async switchTenant(req, body) {
        const userId = req.user.id;
        const userTenant = await this.internalAuth['prisma'].user_tenants.findFirst({
            where: {
                user_id: userId,
                tenants: {
                    tenant_sub: body.tenant_sub,
                    is_active: true,
                },
                is_active: true,
            },
            include: {
                tenants: {
                    select: {
                        tenant_sub: true,
                        slug: true,
                        name: true,
                    },
                },
            },
        });
        if (!userTenant) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                message: 'Tenant not found or not assigned to user',
            });
        }
        return {
            success: true,
            tenant: {
                tenant_sub: userTenant.tenants.tenant_sub,
                slug: userTenant.tenants.slug,
                name: userTenant.tenants.name,
            },
            instructions: {
                message: 'Para usar este tenant en todas las peticiones, agrega el header "x-tenant-sub" con el UUID del tenant',
                headerName: 'x-tenant-sub',
                headerValue: userTenant.tenants.tenant_sub,
            },
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar nuevo usuario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Usuario ya existe o datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activar cuenta con token de activación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cuenta activada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Token inválido o expirado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activation_dto_1.ActivateAccountDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "activateAccount", null);
__decorate([
    (0, common_1.Post)('resend-activation'),
    (0, swagger_1.ApiOperation)({ summary: 'Reenviar email de activación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email de activación enviado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activation_dto_1.ResendActivationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendActivation", null);
__decorate([
    (0, common_1.Post)('request-reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitar recuperación de contraseña' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email de recuperación enviado si el usuario existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.RequestResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestResetPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Restablecer contraseña con token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contraseña restablecida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Token inválido o expirado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('user/:uuid'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener usuario por UUID (clave pública)',
        description: 'Permite consultar información básica del usuario usando su UUID sin exponer el ID interno'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario encontrado',
        schema: {
            type: 'object',
            properties: {
                uuid: { type: 'string', format: 'uuid' },
                userName: { type: 'string' },
                userLastName: { type: 'string' },
                userEmail: { type: 'string' },
                role: {
                    type: 'object',
                    properties: {
                        idrole: { type: 'number' },
                        description: { type: 'string' },
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUserByUuid", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Login del sistema (modo interno o externo)',
        description: 'Retorna el token JWT y lo guarda en una cookie httpOnly'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Login exitoso. Token guardado en cookie y retornado en el body'
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciales inválidas o cuenta no activada' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login-swagger'),
    (0, swagger_1.ApiOperation)({
        summary: 'Login HTML para Swagger (retorna JSON)',
        description: 'Endpoint especial para login desde Swagger UI. Retorna token y lo guarda en cookies'
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginSwagger", null);
__decorate([
    (0, common_1.Get)('debug-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Debug: Ver headers y cookies para autenticación' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "debugAuth", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener perfil del usuario autenticado (requiere JWT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil del usuario autenticado',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number' },
                username: { type: 'string' },
                email: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                role: {
                    type: 'object',
                    properties: {
                        idrole: { type: 'number' },
                        roleName: { type: 'string' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token JWT inválido o faltante',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('test-login'),
    (0, swagger_1.ApiOperation)({ summary: 'Test login rápido para obtener token' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testLogin", null);
__decorate([
    (0, common_1.Get)('test-jwt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Test endpoint para verificar que JWT funciona' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'JWT está funcionando correctamente',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token JWT inválido o faltante',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testJwt", null);
__decorate([
    (0, common_1.Get)('restaurants'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener restaurantes disponibles del token JWT',
        description: 'Decodifica el token JWT y extrae los restaurantes disponibles para el usuario'
    }),
    (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: 'Bearer token JWT',
        required: true,
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Restaurantes obtenidos exitosamente',
        schema: {
            type: 'object',
            properties: {
                hasMultipleRestaurants: { type: 'boolean' },
                restaurants: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            uuid: { type: 'string' },
                            name: { type: 'string' },
                            address: { type: 'string' },
                            database_connection: { type: 'string' },
                            role_in_restaurant: { type: 'string' },
                            is_owner: { type: 'boolean' },
                            can_create_users: { type: 'boolean' },
                        },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Token inválido o no contiene información de restaurantes',
    }),
    __param(0, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getRestaurants", null);
__decorate([
    (0, common_1.Post)('select-restaurant'),
    (0, swagger_1.ApiOperation)({
        summary: 'Seleccionar un restaurante específico',
        description: 'Permite seleccionar un restaurante del token JWT decodificado'
    }),
    (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: 'Bearer token JWT',
        required: true,
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
    (0, swagger_1.ApiBody)({
        description: 'UUID del restaurante a seleccionar',
        schema: {
            type: 'object',
            properties: {
                restaurantUuid: {
                    type: 'string',
                    example: 'eb33e941-85c7-4fe8-8096-c4be1d97acdc',
                    description: 'UUID del restaurante seleccionado'
                }
            },
            required: ['restaurantUuid']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Restaurante seleccionado exitosamente',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                selectedRestaurant: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        uuid: { type: 'string' },
                        name: { type: 'string' },
                        address: { type: 'string' },
                        database_connection: { type: 'string' },
                        role_in_restaurant: { type: 'string' },
                        is_owner: { type: 'boolean' },
                        can_create_users: { type: 'boolean' },
                    },
                },
                instructions: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        headerName: { type: 'string' },
                        headerValue: { type: 'string' }
                    }
                }
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Restaurante no encontrado o UUID inválido',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Token inválido',
    }),
    __param(0, (0, common_1.Headers)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "selectRestaurant", null);
__decorate([
    (0, common_1.Get)('my-tenants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener tenants disponibles para el usuario actual' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de tenants' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMyTenants", null);
__decorate([
    (0, common_1.Post)('switch-tenant'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cambiar tenant activo del usuario' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                tenant_sub: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant cambiado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant no encontrado o no asignado al usuario' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "switchTenant", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('00 - Auth'),
    (0, common_1.Controller)('api/sysUser'),
    __metadata("design:paramtypes", [auth_service_1.InternalAuthService,
        auth_service_2.ExternalAuthService,
        token_service_1.TokenService,
        sse_connection_manager_service_1.SSEConnectionManagerService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map