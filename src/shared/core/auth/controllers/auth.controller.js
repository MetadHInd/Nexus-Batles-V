"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
var error_factory_1 = require("../../../../../../../../../src/shared/errors/error.factory");
var error_codes_enum_1 = require("../../../../../../../../../src/shared/errors/error-codes.enum");
var user_public_mapper_1 = require("../mappers/user-public.mapper");
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('00 - Auth'), (0, common_1.Controller)('api/sysUser')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _register_decorators;
    var _activateAccount_decorators;
    var _resendActivation_decorators;
    var _requestResetPassword_decorators;
    var _resetPassword_decorators;
    var _getUserByUuid_decorators;
    var _login_decorators;
    var _loginSwagger_decorators;
    var _debugAuth_decorators;
    var _getProfile_decorators;
    var _testLogin_decorators;
    var _testJwt_decorators;
    var _getRestaurants_decorators;
    var _selectRestaurant_decorators;
    var _getMyTenants_decorators;
    var _switchTenant_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(internalAuth, externalAuth, tokenService, sseConnectionManager) {
            this.internalAuth = (__runInitializers(this, _instanceExtraInitializers), internalAuth);
            this.externalAuth = externalAuth;
            this.tokenService = tokenService;
            this.sseConnectionManager = sseConnectionManager;
        }
        AuthController_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.internalAuth.register(dto)];
                });
            });
        };
        AuthController_1.prototype.activateAccount = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.internalAuth.activateAccount(dto)];
                });
            });
        };
        AuthController_1.prototype.resendActivation = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.internalAuth.resendActivation(dto)];
                });
            });
        };
        AuthController_1.prototype.requestResetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.internalAuth.requestResetPassword(dto)];
                });
            });
        };
        AuthController_1.prototype.resetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.internalAuth.resetPassword(dto)];
                });
            });
        };
        AuthController_1.prototype.getUserByUuid = function (uuid) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.internalAuth.getSysuserByUuid(uuid)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                                    message: 'User not found',
                                });
                            }
                            return [2 /*return*/, user_public_mapper_1.UserPublicMapper.toPublic(user)];
                    }
                });
            });
        };
        AuthController_1.prototype.login = function (dto, response) {
            return __awaiter(this, void 0, void 0, function () {
                var result, _a, isProduction, cookieOptions;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(process.env.AUTH_EXTERNAL === 'true')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.externalAuth.login(dto)];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.internalAuth.login(dto)];
                        case 3:
                            _a = _b.sent();
                            _b.label = 4;
                        case 4:
                            result = _a;
                            isProduction = process.env.NODE_ENV === 'production';
                            cookieOptions = {
                                httpOnly: true, // No accesible desde JavaScript
                                secure: isProduction, // Solo HTTPS en producción
                                sameSite: 'lax', // Protección CSRF
                                maxAge: 24 * 60 * 60 * 1000, // 24 horas
                                path: '/',
                            };
                            response.cookie('auth_token', result.token, cookieOptions);
                            response.cookie('jwt', result.token, cookieOptions); // Cookie alternativa
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AuthController_1.prototype.loginSwagger = function (dto, response) {
            return __awaiter(this, void 0, void 0, function () {
                var result, _a, isProduction, cookieOptions;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(process.env.AUTH_EXTERNAL === 'true')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.externalAuth.login(dto)];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.internalAuth.login(dto)];
                        case 3:
                            _a = _b.sent();
                            _b.label = 4;
                        case 4:
                            result = _a;
                            isProduction = process.env.NODE_ENV === 'production';
                            cookieOptions = {
                                httpOnly: true,
                                secure: isProduction,
                                sameSite: 'lax',
                                maxAge: 24 * 60 * 60 * 1000,
                                path: '/',
                            };
                            response.cookie('auth_token', result.token, cookieOptions);
                            response.cookie('jwt', result.token, cookieOptions);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AuthController_1.prototype.debugAuth = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log('\n🔍 [Debug] Headers:', req.headers);
                    console.log('🔍 [Debug] Cookies:', req.cookies);
                    return [2 /*return*/, {
                            headers: {
                                authorization: req.headers.authorization || 'Not present',
                                cookie: req.headers.cookie || 'Not present',
                                userAgent: req.headers['user-agent'] || 'Not present',
                            },
                            cookies: req.cookies || 'No cookies found',
                            cookieNames: req.cookies ? Object.keys(req.cookies) : [],
                            timestamp: new Date().toISOString(),
                        }];
                });
            });
        };
        AuthController_1.prototype.getProfile = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: 'JWT funcionando correctamente',
                            user: req.user,
                            timestamp: new Date().toISOString(),
                        }];
                });
            });
        };
        AuthController_1.prototype.testLogin = function () {
            return __awaiter(this, void 0, void 0, function () {
                var loginDto, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            loginDto = {
                                email: 'manuel@galatealabs.ai',
                                password: 'password123',
                            };
                            return [4 /*yield*/, this.internalAuth.login(loginDto)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, {
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
                                }];
                        case 2:
                            error_1 = _a.sent();
                            return [2 /*return*/, {
                                    error: 'Error en login',
                                    details: error_1.message,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.testJwt = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            message: '¡JWT está funcionando perfectamente!',
                            authStrategy: 'jwt',
                            user: req.user,
                            serverTime: new Date().toISOString(),
                        }];
                });
            });
        };
        AuthController_1.prototype.getRestaurants = function (headers) {
            return __awaiter(this, void 0, void 0, function () {
                var authHeader, token, decoded, response, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            authHeader = headers['authorization'];
                            console.log('🔍 [getRestaurants] Auth header:', authHeader ? 'Present' : 'Missing');
                            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                                throw new Error('Token not found');
                            }
                            token = authHeader.replace('Bearer ', '');
                            return [4 /*yield*/, this.tokenService.validateToken(token)];
                        case 1:
                            decoded = _b.sent();
                            console.log('🔓 [getRestaurants] Token decoded:', !!decoded);
                            console.log('🏪 [getRestaurants] Restaurants in token:', ((_a = decoded.restaurants) === null || _a === void 0 ? void 0 : _a.length) || 0);
                            if (!decoded.restaurants || !Array.isArray(decoded.restaurants)) {
                                console.log('❌ [getRestaurants] No restaurants array found in token');
                                throw new Error('No restaurants found in token');
                            }
                            response = {
                                hasMultipleRestaurants: decoded.restaurants.length > 1,
                                restaurants: decoded.restaurants,
                            };
                            console.log('✅ [getRestaurants] Returning response:', response);
                            return [2 /*return*/, response];
                        case 2:
                            error_2 = _b.sent();
                            console.error('❌ [getRestaurants] Error:', error_2.message);
                            throw new Error('Invalid token or no restaurants available');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.selectRestaurant = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                var authHeader, token, decoded, selectedRestaurant, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            authHeader = headers['authorization'];
                            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                                throw new Error('Token not found');
                            }
                            token = authHeader.replace('Bearer ', '');
                            return [4 /*yield*/, this.tokenService.validateToken(token)];
                        case 1:
                            decoded = _a.sent();
                            if (!decoded.restaurants || !Array.isArray(decoded.restaurants)) {
                                throw new Error('No restaurants found in token');
                            }
                            selectedRestaurant = decoded.restaurants.find(function (restaurant) { return restaurant.uuid === body.restaurantUuid; });
                            if (!selectedRestaurant) {
                                throw new Error('Restaurant not found');
                            }
                            // Store the selection in session storage (this will be handled by frontend)
                            return [2 /*return*/, {
                                    success: true,
                                    selectedRestaurant: selectedRestaurant,
                                    instructions: {
                                        message: 'Para usar este restaurante en todas las peticiones, agrega el header "restaurantSub" con el UUID del restaurante',
                                        headerName: 'restaurantSub',
                                        headerValue: selectedRestaurant.uuid
                                    }
                                }];
                        case 2:
                            error_3 = _a.sent();
                            throw new Error('Invalid token or restaurant not available');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthController_1.prototype.getMyTenants = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, userTenants, tenants;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userId = req.user.id;
                            return [4 /*yield*/, this.internalAuth['prisma'].user_tenants.findMany({
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
                                })];
                        case 1:
                            userTenants = _a.sent();
                            tenants = userTenants
                                .filter(function (ut) { return ut.tenants.is_active; })
                                .map(function (ut) { return ({
                                tenant_sub: ut.tenants.tenant_sub,
                                slug: ut.tenants.slug,
                                name: ut.tenants.name,
                                is_default: ut.is_default,
                            }); });
                            return [2 /*return*/, { tenants: tenants }];
                    }
                });
            });
        };
        AuthController_1.prototype.switchTenant = function (req, body) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, userTenant;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userId = req.user.id;
                            return [4 /*yield*/, this.internalAuth['prisma'].user_tenants.findFirst({
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
                                })];
                        case 1:
                            userTenant = _a.sent();
                            if (!userTenant) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                                    message: 'Tenant not found or not assigned to user',
                                });
                            }
                            return [2 /*return*/, {
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
                                }];
                    }
                });
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _register_decorators = [(0, common_1.Post)('register'), (0, swagger_1.ApiOperation)({ summary: 'Registrar nuevo usuario' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado exitosamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Usuario ya existe o datos inválidos' })];
        _activateAccount_decorators = [(0, common_1.Post)('activate'), (0, swagger_1.ApiOperation)({ summary: 'Activar cuenta con token de activación' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Cuenta activada exitosamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Token inválido o expirado' })];
        _resendActivation_decorators = [(0, common_1.Post)('resend-activation'), (0, swagger_1.ApiOperation)({ summary: 'Reenviar email de activación' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Email de activación enviado' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' })];
        _requestResetPassword_decorators = [(0, common_1.Post)('request-reset-password'), (0, swagger_1.ApiOperation)({ summary: 'Solicitar recuperación de contraseña' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Email de recuperación enviado si el usuario existe' })];
        _resetPassword_decorators = [(0, common_1.Post)('reset-password'), (0, swagger_1.ApiOperation)({ summary: 'Restablecer contraseña con token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Contraseña restablecida exitosamente' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Token inválido o expirado' })];
        _getUserByUuid_decorators = [(0, common_1.Get)('user/:uuid'), (0, swagger_1.ApiOperation)({
                summary: 'Obtener usuario por UUID (clave pública)',
                description: 'Permite consultar información básica del usuario usando su UUID sin exponer el ID interno'
            }), (0, swagger_1.ApiResponse)({
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
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' })];
        _login_decorators = [(0, common_1.Post)('login'), (0, swagger_1.ApiOperation)({
                summary: 'Login del sistema (modo interno o externo)',
                description: 'Retorna el token JWT y lo guarda en una cookie httpOnly'
            }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Login exitoso. Token guardado en cookie y retornado en el body'
            }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciales inválidas o cuenta no activada' })];
        _loginSwagger_decorators = [(0, common_1.Post)('login-swagger'), (0, swagger_1.ApiOperation)({
                summary: 'Login HTML para Swagger (retorna JSON)',
                description: 'Endpoint especial para login desde Swagger UI. Retorna token y lo guarda en cookies'
            })];
        _debugAuth_decorators = [(0, common_1.Get)('debug-auth'), (0, swagger_1.ApiOperation)({ summary: 'Debug: Ver headers y cookies para autenticación' })];
        _getProfile_decorators = [(0, common_1.Get)('profile'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({
                summary: 'Obtener perfil del usuario autenticado (requiere JWT)',
            }), (0, swagger_1.ApiResponse)({
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
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'No autorizado - Token JWT inválido o faltante',
            })];
        _testLogin_decorators = [(0, common_1.Get)('test-login'), (0, swagger_1.ApiOperation)({ summary: 'Test login rápido para obtener token' })];
        _testJwt_decorators = [(0, common_1.Get)('test-jwt'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Test endpoint para verificar que JWT funciona' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'JWT está funcionando correctamente',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'No autorizado - Token JWT inválido o faltante',
            })];
        _getRestaurants_decorators = [(0, common_1.Get)('restaurants'), (0, swagger_1.ApiOperation)({
                summary: 'Obtener restaurantes disponibles del token JWT',
                description: 'Decodifica el token JWT y extrae los restaurantes disponibles para el usuario'
            }), (0, swagger_1.ApiHeader)({
                name: 'Authorization',
                description: 'Bearer token JWT',
                required: true,
                example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            }), (0, swagger_1.ApiResponse)({
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
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Token inválido o no contiene información de restaurantes',
            })];
        _selectRestaurant_decorators = [(0, common_1.Post)('select-restaurant'), (0, swagger_1.ApiOperation)({
                summary: 'Seleccionar un restaurante específico',
                description: 'Permite seleccionar un restaurante del token JWT decodificado'
            }), (0, swagger_1.ApiHeader)({
                name: 'Authorization',
                description: 'Bearer token JWT',
                required: true,
                example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            }), (0, swagger_1.ApiBody)({
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
            }), (0, swagger_1.ApiResponse)({
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
            }), (0, swagger_1.ApiResponse)({
                status: 400,
                description: 'Restaurante no encontrado o UUID inválido',
            }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Token inválido',
            })];
        _getMyTenants_decorators = [(0, common_1.Get)('my-tenants'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Obtener tenants disponibles para el usuario actual' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de tenants' })];
        _switchTenant_decorators = [(0, common_1.Post)('switch-tenant'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Cambiar tenant activo del usuario' }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        tenant_sub: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' }
                    }
                }
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant cambiado exitosamente' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant no encontrado o no asignado al usuario' })];
        __esDecorate(_classThis, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: function (obj) { return "register" in obj; }, get: function (obj) { return obj.register; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _activateAccount_decorators, { kind: "method", name: "activateAccount", static: false, private: false, access: { has: function (obj) { return "activateAccount" in obj; }, get: function (obj) { return obj.activateAccount; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resendActivation_decorators, { kind: "method", name: "resendActivation", static: false, private: false, access: { has: function (obj) { return "resendActivation" in obj; }, get: function (obj) { return obj.resendActivation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _requestResetPassword_decorators, { kind: "method", name: "requestResetPassword", static: false, private: false, access: { has: function (obj) { return "requestResetPassword" in obj; }, get: function (obj) { return obj.requestResetPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: function (obj) { return "resetPassword" in obj; }, get: function (obj) { return obj.resetPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserByUuid_decorators, { kind: "method", name: "getUserByUuid", static: false, private: false, access: { has: function (obj) { return "getUserByUuid" in obj; }, get: function (obj) { return obj.getUserByUuid; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _loginSwagger_decorators, { kind: "method", name: "loginSwagger", static: false, private: false, access: { has: function (obj) { return "loginSwagger" in obj; }, get: function (obj) { return obj.loginSwagger; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _debugAuth_decorators, { kind: "method", name: "debugAuth", static: false, private: false, access: { has: function (obj) { return "debugAuth" in obj; }, get: function (obj) { return obj.debugAuth; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProfile_decorators, { kind: "method", name: "getProfile", static: false, private: false, access: { has: function (obj) { return "getProfile" in obj; }, get: function (obj) { return obj.getProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testLogin_decorators, { kind: "method", name: "testLogin", static: false, private: false, access: { has: function (obj) { return "testLogin" in obj; }, get: function (obj) { return obj.testLogin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testJwt_decorators, { kind: "method", name: "testJwt", static: false, private: false, access: { has: function (obj) { return "testJwt" in obj; }, get: function (obj) { return obj.testJwt; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRestaurants_decorators, { kind: "method", name: "getRestaurants", static: false, private: false, access: { has: function (obj) { return "getRestaurants" in obj; }, get: function (obj) { return obj.getRestaurants; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _selectRestaurant_decorators, { kind: "method", name: "selectRestaurant", static: false, private: false, access: { has: function (obj) { return "selectRestaurant" in obj; }, get: function (obj) { return obj.selectRestaurant; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMyTenants_decorators, { kind: "method", name: "getMyTenants", static: false, private: false, access: { has: function (obj) { return "getMyTenants" in obj; }, get: function (obj) { return obj.getMyTenants; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _switchTenant_decorators, { kind: "method", name: "switchTenant", static: false, private: false, access: { has: function (obj) { return "switchTenant" in obj; }, get: function (obj) { return obj.switchTenant; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
