"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.InternalAuthService = void 0;
/* eslint-disable */
// src/modules/auth/services/internal/internal-auth.service.ts
var common_1 = require("@nestjs/common");
var login_response_model_1 = require("../../models/login-response.model");
var service_cache_1 = require("../../../../../../../../../../src/shared/core/services/service-cache/service-cache");
var error_factory_1 = require("../../../../../../../../../../src/shared/errors/error.factory");
var error_codes_enum_1 = require("../../../../../../../../../../src/shared/errors/error-codes.enum");
var generic_error_messages_enum_1 = require("../../../../../../../../../../src/shared/constants/generic-error-messages.enum");
var crypto = require("crypto");
var InternalAuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InternalAuthService = _classThis = /** @class */ (function () {
        function InternalAuthService_1() {
        }
        InternalAuthService_1.prototype.getSysuserByEmail = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
                            where: { userEmail: email },
                        })];
                });
            });
        };
        InternalAuthService_1.prototype.getSysuserByUuid = function (uuid) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
                            where: { uuid: uuid },
                            include: { role_sysUser_roleTorole: true },
                        })];
                });
            });
        };
        InternalAuthService_1.prototype.login = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, error, isValid, availableTenants, defaultTenant, token, userInfo;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getSysuserByEmail(dto.email)];
                        case 1:
                            user = _b.sent();
                            error = {
                                status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
                                message: generic_error_messages_enum_1.GenericErrorMessages.INVALID_CRECENTIALS,
                            };
                            if (!user) {
                                error_factory_1.ErrorFactory.throw(error);
                            }
                            // Verificar si la cuenta está activa
                            if (user.is_active === false) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
                                    message: 'Account not activated. Please check your email.',
                                });
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Authorization.PasswordService.validatePassword(dto.password, user.userPassword || '')];
                        case 2:
                            isValid = _b.sent();
                            if (!isValid) {
                                error_factory_1.ErrorFactory.throw(error);
                            }
                            availableTenants = [];
                            defaultTenant = undefined;
                            token = service_cache_1.ServiceCache.Authorization.TokenService.generateToken({
                                sub: user.idsysUser,
                                role: (_a = user.role) !== null && _a !== void 0 ? _a : 2,
                            });
                            userInfo = {
                                uuid: user.uuid || '',
                                email: user.userEmail || '',
                                userName: user.userName || '',
                                userLastName: user.userLastName || '',
                                idsysUser: user.idsysUser,
                            };
                            return [2 /*return*/, new login_response_model_1.LoginResponseModel(token, userInfo, availableTenants, defaultTenant)];
                    }
                });
            });
        };
        InternalAuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, hashedPassword, activationToken, activationExpires, newUser, activationUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSysuserByEmail(dto.userEmail)];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                                    message: 'User already exists with this email',
                                });
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Authorization.PasswordService.hashPassword(dto.userPassword)];
                        case 2:
                            hashedPassword = _a.sent();
                            activationToken = crypto.randomBytes(32).toString('hex');
                            activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.create({
                                    data: {
                                        userEmail: dto.userEmail,
                                        userPassword: hashedPassword,
                                        userName: dto.userName || null,
                                        userLastName: dto.userLastName || null,
                                        userPhone: dto.userPhone || null,
                                        role: dto.role_idrole || 1, // Por defecto: User role
                                        is_active: true, // Inactivo hasta activar
                                        sysuserstatus_idsysuserstatus: 1,
                                        activation_token: activationToken,
                                        activation_expires: activationExpires,
                                    },
                                })];
                        case 3:
                            newUser = _a.sent();
                            activationUrl = "".concat(process.env.FRONTEND_URL || 'http://localhost:3000', "/auth/activate?token=").concat(activationToken);
                            // TODO: Configurar SMTP para enviar emails de activación
                            // await ServiceCache.Messaging.Email.sendWithTemplate(
                            //   'account-activation',
                            //   {
                            //     userName: dto.userName || dto.userEmail,
                            //     activationUrl,
                            //     activationToken,
                            //     expiresIn: '24 horas',
                            //   },
                            //   dto.userEmail,
                            //   'Activa tu cuenta - Backend',
                            // );
                            console.log('📧 Email de activación (no enviado, configurar SMTP):');
                            console.log("   URL: ".concat(activationUrl));
                            console.log("   Token: ".concat(activationToken));
                            return [2 /*return*/, {
                                    message: 'User registered successfully. Email not sent (configure SMTP). Activation URL logged in console.',
                                    userId: newUser.idsysUser,
                                    activationUrl: activationUrl, // Incluir en respuesta para testing
                                    activationToken: activationToken,
                                }];
                    }
                });
            });
        };
        InternalAuthService_1.prototype.activateAccount = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
                                where: {
                                    activation_token: dto.token,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                                    message: 'Invalid activation token',
                                });
                            }
                            // Verificar si el token expiró
                            if (user.activation_expires && new Date() > user.activation_expires) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                                    message: 'Activation token expired. Please request a new one.',
                                });
                            }
                            // Activar cuenta
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                                    where: { idsysUser: user.idsysUser },
                                    data: {
                                        is_active: true,
                                        activation_token: null,
                                        activation_expires: null,
                                    },
                                })];
                        case 2:
                            // Activar cuenta
                            _a.sent();
                            return [2 /*return*/, { message: 'Account activated successfully. You can now login.' }];
                    }
                });
            });
        };
        InternalAuthService_1.prototype.resendActivation = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, activationToken, activationExpires, activationUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSysuserByEmail(dto.userEmail)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.NOT_FOUND,
                                    message: 'User not found',
                                });
                            }
                            if (user.is_active) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                                    message: 'Account is already activated',
                                });
                            }
                            activationToken = crypto.randomBytes(32).toString('hex');
                            activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                                    where: { idsysUser: user.idsysUser },
                                    data: {
                                        activation_token: activationToken,
                                        activation_expires: activationExpires,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            activationUrl = "".concat(process.env.FRONTEND_URL || 'http://localhost:3000', "/auth/activate?token=").concat(activationToken);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Messaging.Email.sendWithTemplate('account-activation', {
                                    userName: user.userName || user.userEmail,
                                    activationUrl: activationUrl,
                                    activationToken: activationToken,
                                    expiresIn: '24 horas',
                                }, dto.userEmail, 'Reenvío de activación - Backend')];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: 'Activation email sent. Please check your inbox.' }];
                    }
                });
            });
        };
        InternalAuthService_1.prototype.requestResetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, resetToken, resetExpires, resetUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSysuserByEmail(dto.userEmail)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                // Por seguridad, no revelar si el email existe o no
                                return [2 /*return*/, { message: 'If the email exists, a password reset link has been sent.' }];
                            }
                            resetToken = crypto.randomBytes(32).toString('hex');
                            resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                                    where: { idsysUser: user.idsysUser },
                                    data: {
                                        reset_password_token: resetToken,
                                        reset_password_expires: resetExpires,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            resetUrl = "".concat(process.env.FRONTEND_URL || 'http://localhost:3000', "/auth/reset-password?token=").concat(resetToken);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Messaging.Email.sendWithTemplate('password-reset', {
                                    userName: user.userName || user.userEmail,
                                    resetUrl: resetUrl,
                                    resetToken: resetToken,
                                    expiresIn: '1 hora',
                                }, dto.userEmail, 'Recuperación de contraseña - Backend')];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: 'If the email exists, a password reset link has been sent.' }];
                    }
                });
            });
        };
        InternalAuthService_1.prototype.resetPassword = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, hashedPassword;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
                                where: {
                                    reset_password_token: dto.token,
                                },
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                                    message: 'Invalid or expired reset token',
                                });
                            }
                            // Verificar si el token expiró
                            if (user.reset_password_expires && new Date() > user.reset_password_expires) {
                                error_factory_1.ErrorFactory.throw({
                                    status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                                    message: 'Reset token expired. Please request a new one.',
                                });
                            }
                            return [4 /*yield*/, service_cache_1.ServiceCache.Authorization.PasswordService.hashPassword(dto.newPassword)];
                        case 2:
                            hashedPassword = _a.sent();
                            // Actualizar contraseña y limpiar tokens
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                                    where: { idsysUser: user.idsysUser },
                                    data: {
                                        userPassword: hashedPassword,
                                        reset_password_token: null,
                                        reset_password_expires: null,
                                    },
                                })];
                        case 3:
                            // Actualizar contraseña y limpiar tokens
                            _a.sent();
                            return [2 /*return*/, { message: 'Password reset successfully. You can now login with your new password.' }];
                    }
                });
            });
        };
        return InternalAuthService_1;
    }());
    __setFunctionName(_classThis, "InternalAuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InternalAuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InternalAuthService = _classThis;
}();
exports.InternalAuthService = InternalAuthService;
