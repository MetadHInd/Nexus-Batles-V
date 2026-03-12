/* eslint-disable */
// src/modules/auth/services/internal/internal-auth.service.ts
import { Injectable } from '@nestjs/common';
import { LoginDto } from '../../dtos/login.dto';
import { RegisterDto } from '../../dtos/register.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from '../../dtos/reset-password.dto';
import { ActivateAccountDto, ResendActivationDto } from '../../dtos/activation.dto';
import { LoginResponseModel } from '../../models/login-response.model';
import { ServiceCache } from 'src/shared/core/services/service-cache/service-cache';
import { ErrorFactory } from 'src/shared/errors/error.factory';
import { ErrorCodesEnum } from 'src/shared/errors/error-codes.enum';
import { GenericErrorMessages } from 'src/shared/constants/generic-error-messages.enum';
import { AppError } from 'src/shared/errors/app-error.type';
import { IUser, IUserWithRole } from '../../interfaces/user.interface';
import * as crypto from 'crypto';

@Injectable()
export class InternalAuthService {
  public async getSysuserByEmail(email: string): Promise<IUser | null> {
    return ServiceCache.Database.Prisma.sysUser.findFirst({
      where: { userEmail: email },
    }) as Promise<IUser | null>;
  }

  public async getSysuserByUuid(uuid: string): Promise<IUserWithRole | null> {
    return ServiceCache.Database.Prisma.sysUser.findFirst({
      where: { uuid },
      include: { role_sysUser_roleTorole: true },
    }) as Promise<IUserWithRole | null>;
  }

  async login(dto: LoginDto): Promise<LoginResponseModel> {
    const user = await this.getSysuserByEmail(dto.email);

    const error: AppError = {
      status: ErrorCodesEnum.UNAUTHORIZED,
      message: GenericErrorMessages.INVALID_CRECENTIALS,
    };

    if (!user) {
      ErrorFactory.throw(error);
    }

    // Verificar si la cuenta está activa
    if (user.is_active === false) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.UNAUTHORIZED,
        message: 'Account not activated. Please check your email.',
      });
    }

    const isValid =
      await ServiceCache.Authorization.PasswordService.validatePassword(
        dto.password,
        user.userPassword || '',
      );

    if (!isValid) {
      ErrorFactory.throw(error);
    }


    // Multitenancy deshabilitado - retornar array vacío
    const availableTenants = [];
    const defaultTenant = undefined;

    const token = ServiceCache.Authorization.TokenService.generateToken({
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

    return new LoginResponseModel(token, userInfo, availableTenants, defaultTenant);
  }

  async register(dto: RegisterDto): Promise<{ message: string; userId: number; activationUrl?: string; activationToken?: string }> {
    // Verificar si el usuario ya existe
    const existingUser = await this.getSysuserByEmail(dto.userEmail);
    if (existingUser) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.BAD_REQUEST,
        message: 'User already exists with this email',
      });
    }

    // Hash de la contraseña
    const hashedPassword = await ServiceCache.Authorization.PasswordService.hashPassword(dto.userPassword);

    // Generar token de activación
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Crear usuario
    const newUser = await ServiceCache.Database.Prisma.sysUser.create({
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
    });

    // Enviar email de activación (deshabilitado temporalmente)
    const activationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/activate?token=${activationToken}`;
    
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
    console.log(`   URL: ${activationUrl}`);
    console.log(`   Token: ${activationToken}`);

    return {
      message: 'User registered successfully. Email not sent (configure SMTP). Activation URL logged in console.',
      userId: newUser.idsysUser,
      activationUrl, // Incluir en respuesta para testing
      activationToken, // Incluir en respuesta para testing
    };
  }

  async activateAccount(dto: ActivateAccountDto): Promise<{ message: string }> {
    const user = await ServiceCache.Database.Prisma.sysUser.findFirst({
      where: {
        activation_token: dto.token,
      },
    });

    if (!user) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.BAD_REQUEST,
        message: 'Invalid activation token',
      });
    }

    // Verificar si el token expiró
    if (user.activation_expires && new Date() > user.activation_expires) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.BAD_REQUEST,
        message: 'Activation token expired. Please request a new one.',
      });
    }

    // Activar cuenta
    await ServiceCache.Database.Prisma.sysUser.update({
      where: { idsysUser: user.idsysUser },
      data: {
        is_active: true,
        activation_token: null,
        activation_expires: null,
      },
    });

    return { message: 'Account activated successfully. You can now login.' };
  }

  async resendActivation(dto: ResendActivationDto): Promise<{ message: string }> {
    const user = await this.getSysuserByEmail(dto.userEmail);

    if (!user) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.NOT_FOUND,
        message: 'User not found',
      });
    }

    if (user.is_active) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.BAD_REQUEST,
        message: 'Account is already activated',
      });
    }

    // Generar nuevo token de activación
    const activationToken = crypto.randomBytes(32).toString('hex');
    const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    await ServiceCache.Database.Prisma.sysUser.update({
      where: { idsysUser: user.idsysUser },
      data: {
        activation_token: activationToken,
        activation_expires: activationExpires,
      },
    });

    // Enviar email de activación
    const activationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/activate?token=${activationToken}`;
    
    await ServiceCache.Messaging.Email.sendWithTemplate(
      'account-activation',
      {
        userName: user.userName || user.userEmail,
        activationUrl,
        activationToken,
        expiresIn: '24 horas',
      },
      dto.userEmail,
      'Reenvío de activación - Backend',
    );

    return { message: 'Activation email sent. Please check your inbox.' };
  }

  async requestResetPassword(dto: RequestResetPasswordDto): Promise<{ message: string }> {
    const user = await this.getSysuserByEmail(dto.userEmail);

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return { message: 'If the email exists, a password reset link has been sent.' };
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

    await ServiceCache.Database.Prisma.sysUser.update({
      where: { idsysUser: user.idsysUser },
      data: {
        reset_password_token: resetToken,
        reset_password_expires: resetExpires,
      },
    });

    // Enviar email con token de recuperación
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    await ServiceCache.Messaging.Email.sendWithTemplate(
      'password-reset',
      {
        userName: user.userName || user.userEmail,
        resetUrl,
        resetToken,
        expiresIn: '1 hora',
      },
      dto.userEmail,
      'Recuperación de contraseña - Backend',
    );

    return { message: 'If the email exists, a password reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await ServiceCache.Database.Prisma.sysUser.findFirst({
      where: {
        reset_password_token: dto.token,
      },
    });

    if (!user) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.BAD_REQUEST,
        message: 'Invalid or expired reset token',
      });
    }

    // Verificar si el token expiró
    if (user.reset_password_expires && new Date() > user.reset_password_expires) {
      ErrorFactory.throw({
        status: ErrorCodesEnum.BAD_REQUEST,
        message: 'Reset token expired. Please request a new one.',
      });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await ServiceCache.Authorization.PasswordService.hashPassword(dto.newPassword);

    // Actualizar contraseña y limpiar tokens
    await ServiceCache.Database.Prisma.sysUser.update({
      where: { idsysUser: user.idsysUser },
      data: {
        userPassword: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null,
      },
    });

    return { message: 'Password reset successfully. You can now login with your new password.' };
  }
}
