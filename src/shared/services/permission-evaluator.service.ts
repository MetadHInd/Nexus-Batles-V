import { Injectable, Logger } from '@nestjs/common';
import { ServiceCache } from '../core/services/service-cache/service-cache';
import { RedisCacheService } from '../cache/redis-cache.service';

/**
 * 🔐 Servicio para evaluar permisos de usuarios
 * 
 * Resuelve permisos efectivos considerando:
 * - Permisos del rol del usuario
 * - Permisos directos del usuario
 * - Cache de 5 minutos para optimizar performance
 */
@Injectable()
export class PermissionEvaluatorService {
  private readonly logger = new Logger(PermissionEvaluatorService.name);
  private readonly CACHE_TTL = 300; // 5 minutos

  constructor(private readonly cache: RedisCacheService) {}

  /**
   * Verificar si usuario tiene un permiso específico
   * 
   * @param userId - ID del usuario
   * @param moduleCode - Código del módulo (ej: 'users')
   * @param actionCode - Código de la acción (ej: 'create')
   * @param scope - Scope del permiso (opcional, default: 'organization')
   * @returns true si tiene el permiso
   */
  async hasPermission(
    userId: number,
    moduleCode: string,
    actionCode: string,
    scope: string = 'organization',
  ): Promise<boolean> {
    try {
      const permissionCode = `${moduleCode}.${actionCode}.${scope}`;
      const effectivePermissions = await this.getUserEffectivePermissions(userId);
      
      const hasPermission = effectivePermissions.some(
        (p) => p.code === permissionCode && p.is_active,
      );

      this.logger.debug(
        `User ${userId} ${hasPermission ? 'HAS' : 'DOES NOT HAVE'} permission: ${permissionCode}`,
      );

      return hasPermission;
    } catch (error) {
      this.logger.error(`Error checking permission: ${error.message}`);
      return false;
    }
  }

  /**
   * Obtener todos los permisos efectivos de un usuario
   * (permisos de rol + permisos directos)
   * 
   * @param userId - ID del usuario
   * @returns Array de definiciones de permisos
   */
  async getUserEffectivePermissions(userId: number): Promise<any[]> {
    const cacheKey = `user:${userId}:effective-permissions`;

    // Intentar obtener desde cache
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) {
      this.logger.debug(`Returning cached permissions for user ${userId}`);
      return cached;
    }

    try {
      // Obtener usuario con rol
      const user = await ServiceCache.Database.sysUser.findUnique({
        where: { idsysUser: userId },
        include: { role_sysUser_roleTorole: true },
      });

      if (!user) {
        this.logger.warn(`User ${userId} not found`);
        return [];
      }

      // Obtener permisos del rol
      const rolePermissions = await ServiceCache.Database.role_permissions.findMany({
        where: {
          role_id: user.role,
          is_active: true,
        },
        include: {
          permission_definition: true,
        },
      });

      // Obtener permisos directos del usuario
      const userPermissions = await ServiceCache.Database.user_permissions.findMany({
        where: {
          user_id: userId,
          is_active: true,
        },
        include: {
          permission_definition: true,
        },
      });

      // Combinar permisos (user permissions tienen prioridad)
      const allPermissions = new Map<number, any>();

      // Agregar permisos de rol
      rolePermissions.forEach((rp) => {
        if (rp.permission_definition) {
          allPermissions.set(rp.permission_definition.id, rp.permission_definition);
        }
      });

      // Agregar permisos directos (sobrescriben si ya existen)
      userPermissions.forEach((up) => {
        if (up.permission_definition) {
          allPermissions.set(up.permission_definition.id, up.permission_definition);
        }
      });

      const effectivePermissions = Array.from(allPermissions.values());

      // Guardar en cache
      await this.cache.set({ key: cacheKey }, effectivePermissions, this.CACHE_TTL);

      this.logger.debug(`User ${userId} has ${effectivePermissions.length} effective permissions`);

      return effectivePermissions;
    } catch (error) {
      this.logger.error(`Error getting effective permissions: ${error.message}`);
      return [];
    }
  }

  /**
   * Verificar si usuario tiene AL MENOS UNO de los permisos especificados
   * 
   * @param userId - ID del usuario
   * @param permissionCodes - Array de códigos de permisos (ej: ['users.create.organization', 'users.read.organization'])
   * @returns true si tiene al menos uno
   */
  async hasAnyPermission(userId: number, permissionCodes: string[]): Promise<boolean> {
    try {
      const effectivePermissions = await this.getUserEffectivePermissions(userId);
      const permissionCodesSet = new Set(effectivePermissions.map((p) => p.code));

      const hasAny = permissionCodes.some((code) => permissionCodesSet.has(code));

      this.logger.debug(
        `User ${userId} ${hasAny ? 'HAS' : 'DOES NOT HAVE'} any of: ${permissionCodes.join(', ')}`,
      );

      return hasAny;
    } catch (error) {
      this.logger.error(`Error checking any permission: ${error.message}`);
      return false;
    }
  }

  /**
   * Verificar si usuario tiene TODOS los permisos especificados
   * 
   * @param userId - ID del usuario
   * @param permissionCodes - Array de códigos de permisos
   * @returns true si tiene todos
   */
  async hasAllPermissions(userId: number, permissionCodes: string[]): Promise<boolean> {
    try {
      const effectivePermissions = await this.getUserEffectivePermissions(userId);
      const permissionCodesSet = new Set(effectivePermissions.map((p) => p.code));

      const hasAll = permissionCodes.every((code) => permissionCodesSet.has(code));

      this.logger.debug(
        `User ${userId} ${hasAll ? 'HAS' : 'DOES NOT HAVE'} all of: ${permissionCodes.join(', ')}`,
      );

      return hasAll;
    } catch (error) {
      this.logger.error(`Error checking all permissions: ${error.message}`);
      return false;
    }
  }

  /**
   * Verificar si usuario es dueño de un recurso
   * 
   * @param userId - ID del usuario
   * @param resourceType - Tipo de recurso (ej: 'order', 'customer')
   * @param resourceId - ID del recurso
   * @returns true si es el dueño
   */
  async checkOwnership(
    userId: number,
    resourceType: string,
    resourceId: number,
  ): Promise<boolean> {
    try {
      // Mapeo de tipos de recursos a modelos de Prisma
      const resourceModelMap: Record<string, string> = {
        order: 'orders',
        customer: 'client',
        user: 'sysUser',
        agent: 'agent',
        // Agregar más según sea necesario
      };

      const modelName = resourceModelMap[resourceType];
      if (!modelName) {
        this.logger.warn(`Unknown resource type: ${resourceType}`);
        return false;
      }

      // Verificar si el modelo existe
      const model = (ServiceCache.Database as any)[modelName];
      if (!model) {
        this.logger.warn(`Model not found: ${modelName}`);
        return false;
      }

      // Buscar el recurso
      const resource = await model.findUnique({
        where: { id: resourceId },
      });

      if (!resource) {
        this.logger.warn(`Resource not found: ${resourceType}#${resourceId}`);
        return false;
      }

      // Verificar ownership (campo user_id o created_by)
      const isOwner = 
        resource.user_id === userId || 
        resource.created_by === userId ||
        resource.idsysUser === userId;

      this.logger.debug(
        `User ${userId} ${isOwner ? 'IS' : 'IS NOT'} owner of ${resourceType}#${resourceId}`,
      );

      return isOwner;
    } catch (error) {
      this.logger.error(`Error checking ownership: ${error.message}`);
      return false;
    }
  }

  /**
   * Limpiar cache de permisos de un usuario
   * 
   * @param userId - ID del usuario
   */
  async clearUserPermissionsCache(userId: number): Promise<void> {
    const cacheKey = `user:${userId}:effective-permissions`;
    await this.cache.delete(cacheKey);
    this.logger.debug(`Cleared permissions cache for user ${userId}`);
  }

  /**
   * Verificar si usuario es administrador
   * 
   * @param userId - ID del usuario
   * @returns true si es admin
   */
  async isAdmin(userId: number): Promise<boolean> {
    try {
      const user = await ServiceCache.Database.sysUser.findUnique({
        where: { idsysUser: userId },
      });

      // role = 1 es ADMIN
      return user?.role === 1;
    } catch (error) {
      this.logger.error(`Error checking if user is admin: ${error.message}`);
      return false;
    }
  }
}
