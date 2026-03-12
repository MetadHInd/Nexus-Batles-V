import { Injectable, NotFoundException, ConflictException, forwardRef, Inject } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto, RolePaginationDto } from '../dtos/role.dto';
import { RoleModel } from '../models/role.model';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { ServiceCache } from 'src/shared/core/services/service-cache/service-cache';
import { CacheableFactory } from 'src/shared/cache/factories/cacheable.factory';
import { PaginatedResponse, PaginationParams } from 'src/shared/common/dtos/pagination.dto';
import { PaginationUtils } from 'src/shared/common/utils/pagination.utils';
import { RolePermissionService } from 'src/modules/role_permissions/services/role-permission.service';
import { PermissionService } from 'src/modules/permissions/services/permission.service';
import { HierarchyValidator } from 'src/shared/utils/hierarchy-validator.util';

@Injectable()
export class RoleService extends BasePaginatedService {
  constructor(
    cache: RedisCacheService,
    @Inject(forwardRef(() => RolePermissionService))
    private readonly rolePermissionService: RolePermissionService,
    private readonly permissionService: PermissionService,
  ) {
    super(cache);
  }

  private readonly roleCacheKey = 'role';
  private readonly roleListSuffixKey = '_list';

  /**
   * ðŸ”’ Obtiene el tenant_id del contexto global
   * @returns tenant_id activo o null si no existe
   */
  private getTenantId(): string | null {
    try {
      const request = (global as any).currentRequest;
      const tenantId = request?.selectedRestaurant?.database_connection || null;
      console.log('ðŸ” [getTenantId] Tenant obtenido del contexto global:', tenantId);
      console.log('ðŸ” [getTenantId] Selected restaurant:', request?.selectedRestaurant?.name);
      return tenantId;
    } catch (error) {
      console.log('âŒ [getTenantId] Error al obtener tenant:', error);
      return null;
    }
  }

  /**
   * ðŸ”’ Obtiene el tenant_id del contexto global y lanza error si no existe
   * @returns tenant_id activo
   * @throws Error si el tenant_id no estÃ¡ disponible
   */
  private getTenantIdOrFail(): string {
    const tenantId = this.getTenantId();
    if (!tenantId) {
      throw new Error('tenant_id no encontrado en el contexto. AsegÃºrate de que el middleware de tenant estÃ© configurado correctamente.');
    }
    return tenantId;
  }

  /**   * 🎯 Obtiene el ID del rol del usuario desde el contexto global
   * @returns role ID del usuario o null si no está disponible
   */
  private getUserRoleId(): number | null {
    try {
      const request = (global as any).currentRequest;
      const user = request?.user;
      
      if (!user) {
        return null;
      }

      // Extraer el ID del rol desde diferentes posibles ubicaciones en el JWT
      const roleId = user.role?.id || user.role?.idrole || user.localRole || user.role;
      
      return roleId || null;
    } catch (error) {
      return null;
    }
  }

  /**   * ðŸŽ¯ Obtiene la jerarquÃ­a del rol del usuario desde el contexto global
   * @returns hierarchy_level del rol del usuario o null si no estÃ¡ disponible
   */
  private async getUserHierarchy(): Promise<number | null> {
    try {
      const request = (global as any).currentRequest;
      const user = request?.user;
      
      if (!user) {
        console.log('âš ï¸ [getUserHierarchy] No hay usuario en el contexto');
        return null;
      }

      // Extraer el ID del rol desde diferentes posibles ubicaciones en el JWT
      const roleId = user.role?.id || user.role?.idrole || user.localRole || user.role;
      
      if (!roleId) {
        console.log('âš ï¸ [getUserHierarchy] No se encontrÃ³ role ID en el usuario');
        return null;
      }

      // Consultar la jerarquÃ­a del rol en la base de datos
      const role = await ServiceCache.Database.Prisma.role.findUnique({
        where: { idrole: roleId },
        select: { hierarchy_level: true },
      });

      if (!role) {
        console.log(`âš ï¸ [getUserHierarchy] No se encontrÃ³ el rol con ID ${roleId}`);
        return null;
      }

      console.log(`âœ… [getUserHierarchy] Usuario con rol ID ${roleId} tiene jerarquÃ­a: ${role.hierarchy_level}`);
      return role.hierarchy_level || 50;
    } catch (error) {
      console.log('âŒ [getUserHierarchy] Error al obtener jerarquÃ­a:', error);
      return null;
    }
  }

  /**
   * ðŸ›¡ï¸ Valida que el usuario tenga jerarquÃ­a suficiente para una operaciÃ³n
   * @param targetHierarchy - JerarquÃ­a del rol objetivo
   * @param operation - Nombre de la operaciÃ³n (para mensajes de error)
   * @throws ForbiddenException si el usuario no tiene jerarquÃ­a suficiente
   */
  private async validateHierarchy(targetHierarchy: number, operation: string): Promise<void> {
    const userHierarchy = await this.getUserHierarchy();
    
    // Si no se puede determinar la jerarquÃ­a del usuario, permitir por defecto
    // (esto mantiene compatibilidad con versiones anteriores)
    if (userHierarchy === null) {
      console.log('âš ï¸ [validateHierarchy] No se pudo determinar jerarquÃ­a del usuario, permitiendo operaciÃ³n');
      return;
    }

    if (userHierarchy <= targetHierarchy) {
      throw new ConflictException(
        `You do not have sufficient hierarchy to ${operation}. Your level: ${userHierarchy}, Required level: > ${targetHierarchy}`,
      );
    }

    console.log(`âœ… [validateHierarchy] ValidaciÃ³n exitosa: ${userHierarchy} > ${targetHierarchy} para ${operation}`);
  }

  /**
   * ðŸ” Verifica si ya existe un rol con exactamente los mismos permisos activos
   * @param permissionIds - Array de IDs de permisos a comparar
   * @param roleIdToExclude - ID del rol a excluir de la bÃºsqueda (Ãºtil al actualizar un rol existente)
   * @returns El rol duplicado si existe, null si no
   */
  private async checkForDuplicateRolePermissions(
    permissionIds: number[],
    roleIdToExclude?: number,
  ): Promise<{ idrole: number; description: string } | null> {
    // Obtener todos los roles con sus permisos activos
    const allRoles = await ServiceCache.Database.Prisma.role.findMany({
      where: roleIdToExclude ? { idrole: { not: roleIdToExclude } } : undefined,
      include: {
        role_permissions: {
          where: { is_active: true },
          select: { permission_id: true },
        },
      },
    });

    // Normalizar los permission_ids para comparaciÃ³n (ordenados)
    const sortedTargetPermissions = [...permissionIds].sort((a, b) => a - b);

    // Buscar un rol con exactamente los mismos permisos
    for (const role of allRoles) {
      const rolePermissionIds = role.role_permissions
        .map((rp) => rp.permission_id)
        .sort((a, b) => a - b);

      // Comparar si tienen exactamente los mismos permisos
      if (
        rolePermissionIds.length === sortedTargetPermissions.length &&
        rolePermissionIds.every((id, index) => id === sortedTargetPermissions[index])
      ) {
        return {
          idrole: role.idrole,
          description: role.description || '',
        };
      }
    }

    return null;
  }

  async create(dto: CreateRoleDto): Promise<RoleModel> {
    console.log('ðŸ“ [create] DTO recibido:', JSON.stringify(dto, null, 2));

    // ValidaciÃ³n 1: Verificar si ya existe un rol con la misma descripciÃ³n
    const existing = await ServiceCache.Database.Prisma.role.findFirst({
      where: {
        description: dto.description,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Role with description '${dto.description}' already exists`,
      );
    }

    // ValidaciÃ³n 2: Si is_super es true, verificar que no exista otro role super
    if (dto.is_super === true) {
      const existingSuperRole = await ServiceCache.Database.Prisma.role.findFirst({
        where: {
          is_super: true,
        },
      });

      if (existingSuperRole) {
        throw new ConflictException(
          'A super role already exists. Only one super role is allowed.',
        );
      }
    }

    // Definir jerarquía objetivo
    const targetHierarchy = dto.hierarchy_level ?? 50;

    // Validar que el usuario tenga jerarquía suficiente ANTES de crear el rol
    const currentUserRoleId = this.getUserRoleId();
    if (currentUserRoleId) {
      // Obtener jerarquía del usuario actual
      const currentUserRole = await ServiceCache.Database.Prisma.role.findUnique({
        where: { idrole: currentUserRoleId },
        select: { hierarchy_level: true },
      });

      if (currentUserRole) {
        const currentHierarchy = currentUserRole.hierarchy_level || 50;
        
        // Validar que el usuario solo pueda crear roles con jerarquía inferior (números menores)
        // Jerarquía: números mayores = más privilegios, números menores = menos privilegios
        if (currentHierarchy <= targetHierarchy) {
          throw new ConflictException(
            `You do not have sufficient hierarchy to create a role with level ${targetHierarchy}. Your level: ${currentHierarchy}. You can only create roles with hierarchy levels less than ${currentHierarchy}`
          );
        }
      }
    }

    // Validar que los permisos solicitados estÃ©n activos (si se proporcionan)
    if (dto.permission_ids && dto.permission_ids.length > 0) {
      const permissions = await ServiceCache.Database.Prisma.permissions.findMany({
        where: {
          id: { in: dto.permission_ids },
        },
      });

      const inactivePermissions = permissions.filter((p) => !p.is_active);
      if (inactivePermissions.length > 0) {
        const inactiveCodes = inactivePermissions.map((p) => p.code).join(', ');
        throw new ConflictException(
          `Cannot assign inactive permissions: ${inactiveCodes}. Please activate them first`,
        );
      }

      // Verificar que no exista otro rol con exactamente los mismos permisos
      const duplicateRole = await this.checkForDuplicateRolePermissions(dto.permission_ids);
      if (duplicateRole) {
        throw new ConflictException(
          `A role with the same permission set already exists: '${duplicateRole.description}' (ID: ${duplicateRole.idrole}). Cannot create roles with duplicate permission configurations`,
        );
      }
    }

    const created = await ServiceCache.Database.Prisma.role.create({
      data: {
        description: dto.description,
        is_super: dto.is_super ?? false,
        hierarchy_level: targetHierarchy,
      },
    });

    // Obtener todos los permisos disponibles
    const allPermissions = await this.permissionService.findAll(false);
    const activePermissionIds = dto.permission_ids || [];

    // Crear registros en role_permissions para todos los permisos
    // Los que estÃ¡n en permission_ids tendrÃ¡n is_active=true, los demÃ¡s is_active=false
    const rolePermissionsData = allPermissions.map(permission => ({
      role_id: created.idrole,
      permission_id: permission.id,
      is_active: activePermissionIds.includes(permission.id),
    }));

    if (rolePermissionsData.length > 0) {
      await ServiceCache.Database.Prisma.role_permissions.createMany({
        data: rolePermissionsData,
      });
    }

    const model = CacheableFactory.create(created, RoleModel);

    // Actualizar cache del item creado
    await this.cacheSet(
      this.roleCacheKey,
      { id: created.idrole },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return model;
  }

  async findAll(useCache = true): Promise<RoleModel[]> {
    return this.tryCacheOrExecute(
      this.roleCacheKey,
      { key: this.roleListSuffixKey },
      useCache,
      async () => {
        const roles = await ServiceCache.Database.Prisma.role.findMany({
          orderBy: { idrole: 'asc' },
        });

        return roles.map((role) =>
          CacheableFactory.create(role, RoleModel),
        );
      },
    );
  }

  async findAllPaginated(
    paginationDto: RolePaginationDto,
    useCache = true,
  ): Promise<PaginatedResponse<RoleModel>> {
    const { page = 1, limit = 10, search, tenant_id } = paginationDto;

    const cacheKey = `${this.roleListSuffixKey}_paginated_${page}_${limit}_${search}_${tenant_id}`;

    return this.tryCacheOrExecute(
      this.roleCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        const where: any = {};

        if (search) {
          where.description = { contains: search, mode: 'insensitive' };
        }

        if (tenant_id) {
          where.tenant_ids = { has: tenant_id };
        }

        const [roles, total] = await Promise.all([
          ServiceCache.Database.Prisma.role.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { idrole: 'asc' },
          }),
          ServiceCache.Database.Prisma.role.count({ where }),
        ]);

        const items = roles.map((role) =>
          CacheableFactory.create(role, RoleModel),
        );

        return PaginationUtils.createPaginatedResponse(items, new PaginationParams({ page, limit }), total);
      },
    );
  }

  async findOne(id: number, useCache = true): Promise<RoleModel> {
    return this.tryCacheOrExecute(
      this.roleCacheKey,
      { id },
      useCache,
      async () => {
        const role = await ServiceCache.Database.Prisma.role.findUnique({
          where: { idrole: id },
        });

        if (!role) {
          throw new NotFoundException(`Role with ID ${id} not found`);
        }

        return CacheableFactory.create(role, RoleModel);
      },
    );
  }

  async findByDescription(description: string, useCache = true): Promise<RoleModel | null> {
    const cacheKey = `by_description_${description}`;

    return this.tryCacheOrExecute(
      this.roleCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        const role = await ServiceCache.Database.Prisma.role.findFirst({
          where: { description },
        });

        if (!role) {
          return null;
        }

        return CacheableFactory.create(role, RoleModel);
      },
    );
  }

  async update(id: number, dto: UpdateRoleDto): Promise<RoleModel> {
    // Verificar que el rol existe
    const currentRole = await this.findOne(id, false);

    // Validar que el usuario tenga jerarquÃ­a suficiente para modificar este rol
    const currentUserRoleId = this.getUserRoleId();
    if (currentUserRoleId) {
      await HierarchyValidator.validateRoleHierarchy(
        currentUserRoleId,
        id,
        `update role '${currentRole.description}'`,
      );
    }

    // Si se actualiza la descripciÃ³n, verificar que no exista otro con esa descripciÃ³n
    if (dto.description) {
      const existing = await ServiceCache.Database.Prisma.role.findFirst({
        where: {
          description: dto.description,
          idrole: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Role with description '${dto.description}' already exists`,
        );
      }
    }

    // Si se intenta cambiar is_super a true, verificar que no exista otro role super
    if (dto.is_super === true && !currentRole.is_super) {
      const existingSuperRole = await ServiceCache.Database.Prisma.role.findFirst({
        where: {
          is_super: true,
          idrole: { not: id },
        },
      });

      if (existingSuperRole) {
        throw new ConflictException(
          'A super role already exists. Only one super role is allowed.',
        );
      }
    }

    const updated = await ServiceCache.Database.Prisma.role.update({
      where: { idrole: id },
      data: {
        ...(dto.description && { description: dto.description }),
        ...(dto.is_super !== undefined && { is_super: dto.is_super }),
        ...(dto.hierarchy_level !== undefined && { hierarchy_level: dto.hierarchy_level }),
      },
    });

    // Asignar permisos si se proporcionaron (reemplaza los permisos existentes)
    if (dto.permission_ids !== undefined) {
      if (dto.permission_ids.length > 0) {
        await this.rolePermissionService.assignPermissionsToRole(id, {
          permission_ids: dto.permission_ids,
        });
      } else {
        // Si se envÃ­a un arreglo vacÃ­o, desactivar todos los permisos
        await this.rolePermissionService.deactivateAllPermissionsFromRole(id);
      }
    }

    const model = CacheableFactory.create(updated, RoleModel);

    // Actualizar cache del item
    await this.cacheSet(
      this.roleCacheKey,
      { id: updated.idrole },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return model;
  }

  async remove(id: number): Promise<void> {
    // Verificar que el rol existe
    const role = await this.findOne(id, false);

    // Validar que el usuario tenga jerarquÃ­a suficiente para eliminar este rol
    const currentUserRoleId = this.getUserRoleId();
    if (currentUserRoleId) {
      await HierarchyValidator.validateRoleHierarchy(
        currentUserRoleId,
        id,
        `delete role '${role.description}'`,
      );
    }

    // Eliminar todos los permisos asociados al rol antes de eliminarlo
    await this.rolePermissionService.removeAllPermissionsFromRole(id);

    await ServiceCache.Database.Prisma.role.delete({
      where: { idrole: id },
    });

    // Invalidar cache
    await this.cacheDelete(this.roleCacheKey, { id });
    await this.invalidateListCaches();
  }

  private async invalidateListCaches(): Promise<void> {
    await this.cacheDelete(this.roleCacheKey, {
      key: this.roleListSuffixKey,
    });

    // Invalidar cache paginado con patrÃ³n
    const pattern = `${this.roleCacheKey}:${this.roleListSuffixKey}_paginated_*`;
    await this.cache.deletePattern(pattern);

    // Invalidar cache por descripciÃ³n
    const patternByDesc = `${this.roleCacheKey}:by_description_*`;
    await this.cache.deletePattern(patternByDesc);
  }
}

