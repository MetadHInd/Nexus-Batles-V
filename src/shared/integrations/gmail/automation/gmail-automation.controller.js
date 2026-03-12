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
exports.GmailAutomationController = exports.CreateActionDto = exports.CreateFilterDto = exports.UpdateConfigDto = exports.RegisterUserDto = void 0;
// gmail-automation.controller.ts
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
// DTOs para la API
var RegisterUserDto = /** @class */ (function () {
    function RegisterUserDto() {
    }
    return RegisterUserDto;
}());
exports.RegisterUserDto = RegisterUserDto;
var UpdateConfigDto = /** @class */ (function () {
    function UpdateConfigDto() {
    }
    return UpdateConfigDto;
}());
exports.UpdateConfigDto = UpdateConfigDto;
var CreateFilterDto = /** @class */ (function () {
    function CreateFilterDto() {
        this.enabled = true;
    }
    return CreateFilterDto;
}());
exports.CreateFilterDto = CreateFilterDto;
var CreateActionDto = /** @class */ (function () {
    function CreateActionDto() {
        this.enabled = true;
    }
    return CreateActionDto;
}());
exports.CreateActionDto = CreateActionDto;
var GmailAutomationController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('15 - Gmail Automation'), (0, common_1.Controller)('gmail/automation')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _registerUser_decorators;
    var _unregisterUser_decorators;
    var _testUserConfig_decorators;
    var _forceCheck_decorators;
    var _getServiceStatus_decorators;
    var _setupSimpleLogging_decorators;
    var _setupSupportAutomation_decorators;
    var GmailAutomationController = _classThis = /** @class */ (function () {
        function GmailAutomationController_1(automationService) {
            this.automationService = (__runInitializers(this, _instanceExtraInitializers), automationService);
            this.logger = new common_1.Logger(GmailAutomationController.name);
        }
        GmailAutomationController_1.prototype.registerUser = function (registerDto) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.automationService.registerUser({
                                    userId: registerDto.userId,
                                    accessToken: registerDto.accessToken,
                                    refreshToken: registerDto.refreshToken,
                                    filters: registerDto.filters || [],
                                    actions: registerDto.actions || []
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Usuario ".concat(registerDto.userId, " registrado para monitoreo autom\u00E1tico")
                                }];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error("Error registrando usuario ".concat(registerDto.userId, ":"), error_1);
                            throw new common_1.HttpException(error_1.message || 'Error registrando usuario', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GmailAutomationController_1.prototype.unregisterUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.automationService.unregisterUser(userId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Usuario ".concat(userId, " desregistrado del monitoreo")
                                }];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error("Error desregistrando usuario ".concat(userId, ":"), error_2);
                            throw new common_1.HttpException(error_2.message || 'Error desregistrando usuario', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GmailAutomationController_1.prototype.testUserConfig = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            // Esto forzará el procesamiento inmediato para el usuario
                            return [4 /*yield*/, this.automationService.processUserEmailsManually(userId)];
                        case 1:
                            // Esto forzará el procesamiento inmediato para el usuario
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Configuraci\u00F3n probada para usuario ".concat(userId),
                                    results: {
                                        message: 'Procesamiento manual completado. Revisa los logs para ver los resultados.'
                                    }
                                }];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error("Error probando configuraci\u00F3n para usuario ".concat(userId, ":"), error_3);
                            throw new common_1.HttpException(error_3.message || 'Error probando configuración', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GmailAutomationController_1.prototype.forceCheck = function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.automationService.forceCheck()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Verificación manual ejecutada para todos los usuarios activos'
                                }];
                        case 2:
                            error_4 = _a.sent();
                            this.logger.error('Error en verificación forzada:', error_4);
                            throw new common_1.HttpException(error_4.message || 'Error en verificación forzada', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GmailAutomationController_1.prototype.getServiceStatus = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            status: 'active',
                            message: 'Servicio de automatización Gmail activo',
                            lastCheck: new Date(),
                            intervalMs: 30000,
                            info: 'El servicio verifica correos nuevos cada 30 segundos automáticamente'
                        }];
                });
            });
        };
        GmailAutomationController_1.prototype.setupSimpleLogging = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var simpleConfig, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            simpleConfig = {
                                userId: body.userId,
                                accessToken: body.accessToken,
                                refreshToken: body.refreshToken,
                                // Sin filtros específicos - procesará todos los correos nuevos
                                filters: [],
                                // Sin acciones específicas - usará la acción por defecto (logging)
                                actions: []
                            };
                            return [4 /*yield*/, this.automationService.registerUser(simpleConfig)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Automatización simple configurada. Todos los correos nuevos se registrarán en los logs.',
                                    config: simpleConfig
                                }];
                        case 2:
                            error_5 = _a.sent();
                            throw new common_1.HttpException(error_5.message || 'Error configurando automatización simple', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GmailAutomationController_1.prototype.setupSupportAutomation = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var supportConfig, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            supportConfig = {
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
                            return [4 /*yield*/, this.automationService.registerUser(supportConfig)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Automatización de soporte configurada exitosamente',
                                    config: supportConfig
                                }];
                        case 2:
                            error_6 = _a.sent();
                            throw new common_1.HttpException(error_6.message || 'Error configurando automatización de soporte', common_1.HttpStatus.BAD_REQUEST);
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return GmailAutomationController_1;
    }());
    __setFunctionName(_classThis, "GmailAutomationController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _registerUser_decorators = [(0, common_1.Post)('register'), (0, swagger_1.ApiOperation)({ summary: 'Registrar usuario para monitoreo automático de correos' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado exitosamente' })];
        _unregisterUser_decorators = [(0, common_1.Delete)('users/:userId'), (0, swagger_1.ApiOperation)({ summary: 'Desregistrar usuario del monitoreo automático' }), (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario desregistrado exitosamente' })];
        _testUserConfig_decorators = [(0, common_1.Post)('users/:userId/test'), (0, swagger_1.ApiOperation)({ summary: 'Probar configuración de usuario procesando correos manualmente' }), (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Prueba ejecutada exitosamente' })];
        _forceCheck_decorators = [(0, common_1.Post)('force-check'), (0, swagger_1.ApiOperation)({ summary: 'Forzar verificación manual de todos los usuarios' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Verificación forzada exitosamente' })];
        _getServiceStatus_decorators = [(0, common_1.Get)('status'), (0, swagger_1.ApiOperation)({ summary: 'Obtener estado del servicio de automatización' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado del servicio obtenido exitosamente' })];
        _setupSimpleLogging_decorators = [(0, common_1.Post)('examples/setup-simple-logging'), (0, swagger_1.ApiOperation)({ summary: 'Configurar automatización simple que solo registra correos nuevos' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Automatización simple configurada' })];
        _setupSupportAutomation_decorators = [(0, common_1.Post)('examples/setup-support-automation'), (0, swagger_1.ApiOperation)({ summary: 'Configurar automatización de ejemplo para correos de soporte' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Automatización de soporte configurada' })];
        __esDecorate(_classThis, null, _registerUser_decorators, { kind: "method", name: "registerUser", static: false, private: false, access: { has: function (obj) { return "registerUser" in obj; }, get: function (obj) { return obj.registerUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unregisterUser_decorators, { kind: "method", name: "unregisterUser", static: false, private: false, access: { has: function (obj) { return "unregisterUser" in obj; }, get: function (obj) { return obj.unregisterUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testUserConfig_decorators, { kind: "method", name: "testUserConfig", static: false, private: false, access: { has: function (obj) { return "testUserConfig" in obj; }, get: function (obj) { return obj.testUserConfig; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forceCheck_decorators, { kind: "method", name: "forceCheck", static: false, private: false, access: { has: function (obj) { return "forceCheck" in obj; }, get: function (obj) { return obj.forceCheck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getServiceStatus_decorators, { kind: "method", name: "getServiceStatus", static: false, private: false, access: { has: function (obj) { return "getServiceStatus" in obj; }, get: function (obj) { return obj.getServiceStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setupSimpleLogging_decorators, { kind: "method", name: "setupSimpleLogging", static: false, private: false, access: { has: function (obj) { return "setupSimpleLogging" in obj; }, get: function (obj) { return obj.setupSimpleLogging; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setupSupportAutomation_decorators, { kind: "method", name: "setupSupportAutomation", static: false, private: false, access: { has: function (obj) { return "setupSupportAutomation" in obj; }, get: function (obj) { return obj.setupSupportAutomation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GmailAutomationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GmailAutomationController = _classThis;
}();
exports.GmailAutomationController = GmailAutomationController;
