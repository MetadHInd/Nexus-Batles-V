"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalAuthService = void 0;
const common_1 = require("@nestjs/common");
const login_response_model_1 = require("../../models/login-response.model");
const service_cache_1 = require("../../../services/service-cache/service-cache");
const error_factory_1 = require("../../../../errors/error.factory");
const error_codes_enum_1 = require("../../../../errors/error-codes.enum");
const generic_error_messages_enum_1 = require("../../../../constants/generic-error-messages.enum");
const crypto = require("crypto");
let InternalAuthService = class InternalAuthService {
    async getSysuserByEmail(email) {
        return service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
            where: { userEmail: email },
        });
    }
    async getSysuserByUuid(uuid) {
        return service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
            where: { uuid },
            include: { role_sysUser_roleTorole: true },
        });
    }
    async login(dto) {
        const user = await this.getSysuserByEmail(dto.email);
        const error = {
            status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
            message: generic_error_messages_enum_1.GenericErrorMessages.INVALID_CRECENTIALS,
        };
        if (!user) {
            error_factory_1.ErrorFactory.throw(error);
        }
        if (user.is_active === false) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.UNAUTHORIZED,
                message: 'Account not activated. Please check your email.',
            });
        }
        const isValid = await service_cache_1.ServiceCache.Authorization.PasswordService.validatePassword(dto.password, user.userPassword || '');
        if (!isValid) {
            error_factory_1.ErrorFactory.throw(error);
        }
        const availableTenants = [];
        const defaultTenant = undefined;
        const token = service_cache_1.ServiceCache.Authorization.TokenService.generateToken({
            sub: user.idsysUser,
            role: user.role ?? 2,
        });
        const userInfo = {
            uuid: user.uuid || '',
            email: user.userEmail || '',
            userName: user.userName || '',
            userLastName: user.userLastName || '',
            idsysUser: user.idsysUser,
        };
        return new login_response_model_1.LoginResponseModel(token, userInfo, availableTenants, defaultTenant);
    }
    async register(dto) {
        const existingUser = await this.getSysuserByEmail(dto.userEmail);
        if (existingUser) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                message: 'User already exists with this email',
            });
        }
        const hashedPassword = await service_cache_1.ServiceCache.Authorization.PasswordService.hashPassword(dto.userPassword);
        const activationToken = crypto.randomBytes(32).toString('hex');
        const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const newUser = await service_cache_1.ServiceCache.Database.Prisma.sysUser.create({
            data: {
                userEmail: dto.userEmail,
                userPassword: hashedPassword,
                userName: dto.userName || null,
                userLastName: dto.userLastName || null,
                userPhone: dto.userPhone || null,
                role: dto.role_idrole || 1,
                is_active: true,
                sysuserstatus_idsysuserstatus: 1,
                activation_token: activationToken,
                activation_expires: activationExpires,
            },
        });
        const activationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/activate?token=${activationToken}`;
        console.log('📧 Email de activación (no enviado, configurar SMTP):');
        console.log(`   URL: ${activationUrl}`);
        console.log(`   Token: ${activationToken}`);
        return {
            message: 'User registered successfully. Email not sent (configure SMTP). Activation URL logged in console.',
            userId: newUser.idsysUser,
            activationUrl,
            activationToken,
        };
    }
    async activateAccount(dto) {
        const user = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
            where: {
                activation_token: dto.token,
            },
        });
        if (!user) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                message: 'Invalid activation token',
            });
        }
        if (user.activation_expires && new Date() > user.activation_expires) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                message: 'Activation token expired. Please request a new one.',
            });
        }
        await service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
            where: { idsysUser: user.idsysUser },
            data: {
                is_active: true,
                activation_token: null,
                activation_expires: null,
            },
        });
        return { message: 'Account activated successfully. You can now login.' };
    }
    async resendActivation(dto) {
        const user = await this.getSysuserByEmail(dto.userEmail);
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
        const activationToken = crypto.randomBytes(32).toString('hex');
        const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
            where: { idsysUser: user.idsysUser },
            data: {
                activation_token: activationToken,
                activation_expires: activationExpires,
            },
        });
        const activationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/activate?token=${activationToken}`;
        await service_cache_1.ServiceCache.Messaging.Email.sendWithTemplate('account-activation', {
            userName: user.userName || user.userEmail,
            activationUrl,
            activationToken,
            expiresIn: '24 horas',
        }, dto.userEmail, 'Reenvío de activación - Backend');
        return { message: 'Activation email sent. Please check your inbox.' };
    }
    async requestResetPassword(dto) {
        const user = await this.getSysuserByEmail(dto.userEmail);
        if (!user) {
            return { message: 'If the email exists, a password reset link has been sent.' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);
        await service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
            where: { idsysUser: user.idsysUser },
            data: {
                reset_password_token: resetToken,
                reset_password_expires: resetExpires,
            },
        });
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
        await service_cache_1.ServiceCache.Messaging.Email.sendWithTemplate('password-reset', {
            userName: user.userName || user.userEmail,
            resetUrl,
            resetToken,
            expiresIn: '1 hora',
        }, dto.userEmail, 'Recuperación de contraseña - Backend');
        return { message: 'If the email exists, a password reset link has been sent.' };
    }
    async resetPassword(dto) {
        const user = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findFirst({
            where: {
                reset_password_token: dto.token,
            },
        });
        if (!user) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                message: 'Invalid or expired reset token',
            });
        }
        if (user.reset_password_expires && new Date() > user.reset_password_expires) {
            error_factory_1.ErrorFactory.throw({
                status: error_codes_enum_1.ErrorCodesEnum.BAD_REQUEST,
                message: 'Reset token expired. Please request a new one.',
            });
        }
        const hashedPassword = await service_cache_1.ServiceCache.Authorization.PasswordService.hashPassword(dto.newPassword);
        await service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
            where: { idsysUser: user.idsysUser },
            data: {
                userPassword: hashedPassword,
                reset_password_token: null,
                reset_password_expires: null,
            },
        });
        return { message: 'Password reset successfully. You can now login with your new password.' };
    }
};
exports.InternalAuthService = InternalAuthService;
exports.InternalAuthService = InternalAuthService = __decorate([
    (0, common_1.Injectable)()
], InternalAuthService);
//# sourceMappingURL=auth.service.js.map