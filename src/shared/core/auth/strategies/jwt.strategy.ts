/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ServiceCache } from '../../services/service-cache/service-cache';
import { Request } from 'express';

import { UserAuth } from 'src/shared/core/auth/interfaces/shared/user-auth.interface';
import { JwtSecretProvider } from '../services/shared/jwt-secret.provider';
import { IJWTUserResponse, IUserProfile } from '../interfaces/user.interface';

interface JWTPayload {
  sub: number;
  role?: number;
  authRole?: number;
  authorization_role?: number;
  customerId?: number;
  sessionId?: number;
  sessionUuid?: string;
  tenant_id?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtSecretProvider: JwtSecretProvider,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Header Authorization: Bearer <token>
        (request: Request) => {
          // Check for GuestToken header (for catering endpoints)
          const guestToken = request.headers['guesttoken'] || request.headers['GuestToken'];
          if (guestToken) {
            // Handle token with or without Bearer prefix
            const token = typeof guestToken === 'string' && guestToken.startsWith('Bearer ') 
              ? guestToken.replace('Bearer ', '') 
              : guestToken;
            return token;
          }
          return null;
        },
        (request: Request) => {
          let token: string | null = null;
          if (request && request.cookies) {
            // Buscar en diferentes nombres de cookies
            const cookies = request.cookies as Record<
              string,
              string | undefined
            >;
            token =
              cookies?.['auth_token'] ||
              cookies?.['authToken'] ||
              cookies?.['jwt'] ||
              cookies?.['access_token'] ||
              cookies?.['token'] ||
              null;
          }

          console.log(`Found Token ${token}`);

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        request: Request,
        rawJwtToken: string,
        done: (err: any, secret?: string) => void,
      ) => {
        const secret = this.jwtSecretProvider.getSecret();
        done(null, secret);
      },
    });

    // Manual verification for debugging
    try {
      const jwt = require('jsonwebtoken');
      // Example: use the token from the last cookie log or paste a test token here
      const testToken = process.env.TEST_JWT_TOKEN || '';
      if (testToken) {
        const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
      }
    } catch (err) {
      // Error verifying test token
    }
  }

  async validate(payload: UserAuth): Promise<IJWTUserResponse> {
    // Extraer el ID del usuario desde diferentes campos posibles
    const userId =
      payload.sub || payload.usersub || payload.idsysUser || payload.id;

    if (!userId) {
      throw new UnauthorizedException('Token inválido: falta ID de usuario');
    }

    // Manejo especial para usuarios invitados
    if (payload.isGuest || payload.userType === 'guest') {
      return {
        userId: userId.toString(),
        uuid: userId.toString(),
        username: payload.name || `Guest-${userId}`,
        email: payload.email || `guest-${userId}@temporary.local`,
        firstName: payload.name || 'Guest',
        lastName: '',
        fullName: payload.name || `Guest ${userId}`,
        phoneNumber: payload.phoneNumber || null,
        
        // Rol de invitado
        authorizationRole: 1, // USER
        authorizationRoleName: 'USER',
        localRole: 1,
        localRoleName: 'Guest User',
        
        role: { id: 1, description: 'Guest User' },
        roleName: 'Guest User',
        
        status: 1,
        statusName: 'Active',
        
        branches: [],
        tenants: [],
        
        // Permisos mínimos para invitados
        permissions: {
          canAccessBranch: () => false,
          canManageBranch: () => false,
          hasRole: () => false,
          isManager: false,
          managedBranches: [],
          accessibleBranches: [],
        },
        
        // Flags especiales
        isAIAUser: false,
        isSuperAdmin: false,
        isGlobalAdmin: false,
        isAssistant: false,
        isGuest: true,
        
        // Control de sesión
        sessionId: payload.sessionId,
        loginAt: payload.loginAt,
        userType: 'guest',
        
        profile: null,
      };
    }

    // 🔥 Manejo especial para customers (usuarios de ordering online)
    if (payload.isCustomer || payload.userType === 'customer') {
      return {
        userId: userId.toString(),
        uuid: userId.toString(),
        username: payload.name || `Customer-${userId}`,
        email: payload.email || '',
        firstName: payload.name || 'Customer',
        lastName: '',
        fullName: payload.name || `Customer ${userId}`,
        phoneNumber: payload.phoneNumber || payload.phone || null,
        
        // Rol de customer
        authorizationRole: 1, // USER
        authorizationRoleName: 'CUSTOMER',
        localRole: 1,
        localRoleName: 'Customer',
        
        role: { id: 1, description: 'Customer' },
        roleName: 'Customer',
        
        status: 1,
        statusName: 'Active',
        
        branches: [],
        tenants: [],
        
        // Permisos mínimos para customers
        permissions: {
          canAccessBranch: () => false,
          canManageBranch: () => false,
          hasRole: () => false,
          isManager: false,
          managedBranches: [],
          accessibleBranches: [],
        },
        
        // Flags especiales
        isAIAUser: false,
        isSuperAdmin: false,
        isGlobalAdmin: false,
        isAssistant: false,
        isCustomer: true,
        
        // Control de sesión y datos del customer
        customerId: payload.customerId,
        sessionId: payload.sessionId,
        sessionUuid: payload.sessionUuid,
        userType: 'customer',
        
        // Información multi-tenant
        tenant_id: payload.tenant_id,
        
        profile: null,
      };
    }

    try {
      // Buscar usuario usando ServiceCache
      const user = await ServiceCache.Database.Prisma.sysUser.findUnique({
        where: { idsysUser: userId },
        include: {
          role_sysUser_roleTorole: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Construir perfil de usuario
      const userProfile = {
        userId: user.idsysUser,
        uuid: user.uuid || '', // UUID real de la base de datos
        email: user.userEmail || '',
        name: user.userName,
        lastName: user.userLastName,
        lastname: user.userLastName, // alias para compatibilidad
        fullName: `${user.userName || ''} ${user.userLastName || ''}`.trim(),
        role: {
          id: user.role,
          description: user.role_sysUser_roleTorole?.description || 'User',
        },
        roleId: user.role,
        roleName: user.role_sysUser_roleTorole?.description || 'User',
        isActive: user.is_active !== false,
        status: user.is_active ? 1 : 0,
        statusName: user.is_active ? 'Active' : 'Inactive',
        branches: [], // TODO: implementar branches desde organizations/teams
        getPermissions: () => ({
          canAccessBranch: () => false,
          canManageBranch: () => false,
          hasRole: () => false,
          isManager: false,
          managedBranches: [],
          accessibleBranches: [],
        }),
      };

      // Verificar que el usuario esté activo
      if (!userProfile.isActive) {
        throw new UnauthorizedException('Usuario inactivo');
      }

      // Actualizar última actividad usando ServiceCache
      await ServiceCache.Database.Prisma.sysUser.update({
        where: { idsysUser: userId },
        data: { updated_at: new Date() },
      });


      // Preparar respuesta con información completa
      const userResponse: IJWTUserResponse = {
        userId: userProfile.userId,
        uuid: userProfile.uuid,
        username: userProfile.name,
        email: userProfile.email,
        firstName: userProfile.name,
        lastName: userProfile.lastname,
        fullName: userProfile.fullName,
        phoneNumber: user.userPhone, // Teléfono del usuario desde la BD

        // Rol de Authorization (del JWT) - Global
        authorizationRole:
          payload.role || payload.authRole || payload.authorization_role,
        authorizationRoleName: this.getAuthorizationRoleName(
          payload.role || payload.authRole || payload.authorization_role,
        ),

        // Rol Local (del sistema) - De la tabla role
        localRole: userProfile.role.id,
        localRoleName: userProfile.roleName,

        // Información de rol (backward compatibility)
        role: userProfile.role,
        roleName: userProfile.roleName,

        // Información de estado
        status: userProfile.status,
        statusName: userProfile.statusName,

        // Información de branches
        branches: userProfile.branches,
        tenants: [],

        // Permisos calculados - Verificación adicional de seguridad
        permissions: (() => {
          try {
            if (
              userProfile &&
              typeof userProfile.getPermissions === 'function'
            ) {
              return userProfile.getPermissions();
          } else {

            return {
              canAccessBranch: () => false,
              canManageBranch: () => false,
              hasRole: () => false,
              isManager: false,
              managedBranches: [],
              accessibleBranches: [],
            };
          }
          } catch (error) {
 
          return {
            canAccessBranch: () => false,
            canManageBranch: () => false,
            hasRole: () => false,
            isManager: false,
            managedBranches: [],
            accessibleBranches: [],
          };
        }
      })(),        // Verificaciones de seguridad
        isAIAUser: userProfile.role.id === 5, // LocalRole.AIA
        isSuperAdmin:
          (payload.role || payload.authRole || payload.authorization_role) ===
          5, // AuthorizationRole.SUPER_ADMIN
        isGlobalAdmin: [4, 5, 6].includes(
          payload.role || payload.authRole || payload.authorization_role,
        ), // ADMIN_AUTHORIZED_ORIGIN, SUPER_ADMIN o ASSISTANT
        isAssistant:
          (payload.role || payload.authRole || payload.authorization_role) ===
          6, // AuthorizationRole.ASSISTANT

        // Control de sesión y tipo de usuario
        userType: 'user',
        sessionId: payload.sessionId,
        sessionUuid: payload.sessionUuid,
        loginAt: new Date().toISOString(),
        
        // Información multi-tenant (si existe en el payload)
        tenant_id: payload.tenant_id,

        // Perfil completo para uso interno
        profile: userProfile,
      };


      return userResponse;
    } catch (error) {
      throw new UnauthorizedException('Error al validar usuario');
    }
  }

  /**
   * Mapear ID de rol de authorization a nombre legible
   */
  private getAuthorizationRoleName(roleId: number): string {
    const roleNames = {
      1: 'USER',
      2: 'ADMIN',
      3: 'SUPERVISOR',
      4: 'ADMIN_AUTHORIZED_ORIGIN',
      5: 'SUPER_ADMIN',
      6: 'ASSISTANT',
    };

    return roleNames[roleId] || 'UNKNOWN';
  }
}
