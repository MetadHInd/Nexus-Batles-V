import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import {
  CreateRolePermissionDto,
  UpdateRolePermissionDto,
  RolePermissionPaginationDto,
  AssignPermissionsToRoleDto,
} from '../dtos/role-permission.dto';
import { RolePermissionModel, RolePermissionDetailModel } from '../models/role-permission.model';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { ServiceCache } from 'src/shared/core/services/service-cache/service-cache';
import { CacheableFactory } from 'src/shared/cache/factories/cacheable.factory';
import { PaginatedResponse, PaginationParams } from 'src/shared/common/dtos/pagination.dto';
import { PaginationUtils } from 'src/shared/common/utils/pagination.utils';
import { PermissionService } from 'src/modules/permissions/services/permission.service';
import { HierarchyValidator } from 'src/shared/utils/hierarchy-validator.util';

@Injectable()
export class RolePermissionService extends BasePaginatedService {
  constructor(
    cache: RedisCacheService,
    private readonly permissionService: PermissionService,
  ) {
    super(cache);
  }

  private readonly rolePermissionCacheKey = 'role_permission';
  private readonly rolePermissionListSuffixKey = '_list';

  /**
   * 🎯 Obtiene el ID del rol del usuario desde el contexto global
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

  async create(dto: CreateRolePermissionDto): Promise<RolePermissionModel> {
    // Verificar que el rol existe
    const role = await ServiceCache.Database.Prisma.role.findFirst({
      where: {
        idrole: dto.role_id,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${dto.role_id} not found`);
    }

    // Validar que el usuario tenga jerarquía suficiente para modificar este rol
    const currentUserRoleId = this.getUserRoleId();
    if (currentUserRoleId) {
      await HierarchyValidator.validateRoleHierarchy(
        currentUserRoleId,
        dto.role_id,
        `assign permissions to role`,
      );
    }

    // Buscar el permiso por código
    const permission = await this.permissionService.findByCode(dto.permission_code, false);

    if (!permission) {
      throw new NotFoundException(`Permission with code '${dto.permission_code}' not found`);
    }

    // Verificar si el permiso está activo en la tabla permissions
    if (!permission.is_active) {
      throw new ConflictException(
        `Cannot assign permission '${dto.permission_code}' because it is currently inactive in the system`,
      );
    }

    // Verificar si ya existe la relación
    const existing = await ServiceCache.Database.Prisma.role_permissions.findFirst({
      where: {
        role_id: dto.role_id,
        permission_id: permission.id
      },
    });

    if (existing) {
      // Si existe pero está inactivo en role_permissions
      if (!existing.is_active) {
        throw new ConflictException(
          `The relationship between role ${dto.role_id} and permission '${dto.permission_code}' already exists but is currently inactive. Please activate it instead of creating a new one`,
        );
      }
      // Si existe y está activo
      throw new ConflictException(
        `Role ${dto.role_id} already has permission '${dto.permission_code}' assigned and active`,
      );
    }

    const created = await ServiceCache.Database.Prisma.role_permissions.create({
      data: {
        role_id: dto.role_id,
        permission_id: permission.id,
        is_active: dto.is_active ?? true
      },
    });

    const model = CacheableFactory.create(created, RolePermissionModel);

    // Actualizar cache del item creado
    await this.cacheSet(
      this.rolePermissionCacheKey,
      { id: created.id },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return model;
  }

  async findAll(useCache = true): Promise<any> {
    const cacheKey = this.rolePermissionListSuffixKey;

    return this.tryCacheOrExecute(
      this.rolePermissionCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        const rolePermissions = await ServiceCache.Database.Prisma.role_permissions.findMany({
          include: {
            permissions: true,
            role: true,
          },
          orderBy: { role_id: 'asc' },
        });

        // Agrupar por rol
        const rolesMap = new Map();
        
        for (const rp of rolePermissions) {
          if (!rp.role) continue;
          
          const roleId = rp.role.idrole;
          
          if (!rolesMap.has(roleId)) {
            rolesMap.set(roleId, {
              role: {
                idrole: rp.role.idrole,
                description: rp.role.description,
              },
              permissions: [],
            });
          }
          
          if (rp.permissions) {
            rolesMap.get(roleId).permissions.push({
              id: rp.permissions.id,
              code: rp.permissions.code,
              name: rp.permissions.name,
              description: rp.permissions.description,
              is_active: rp.permissions.is_active,
              action_id: rp.permissions.action_id,
            });
          }
        }

        return {
          data: Array.from(rolesMap.values()),
        };
      },
    );
  }

  async findAllPaginated(
    paginationDto: RolePermissionPaginationDto,
    useCache = true,
  ): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 10, role_id, permission_code } = paginationDto;
    const cacheKey = `${this.rolePermissionListSuffixKey}_paginated_${page}_${limit}_${role_id}_${permission_code}`;

    return this.tryCacheOrExecute(
      this.rolePermissionCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        const where: any = {};

        if (role_id !== undefined) {
          where.role_id = role_id;
        }

        if (permission_code !== undefined) {
          const permission = await this.permissionService.findByCode(permission_code, false);
          if (permission) {
            where.permission_id = permission.id;
          } else {
            // Si el código no existe, retornar lista vacía
            return PaginationUtils.createPaginatedResponse([], new PaginationParams({ page, limit }), 0);
          }
        }

        const [rolePermissions, total] = await Promise.all([
          ServiceCache.Database.Prisma.role_permissions.findMany({
            where,
            include: {
              permissions: true,
              role: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { id: 'asc' },
          }),
          ServiceCache.Database.Prisma.role_permissions.count({ where }),
        ]);

        const items = rolePermissions.map((rp) => ({
          ...CacheableFactory.create(rp, RolePermissionModel).toJSON(),
          permission: rp.permissions ? {
            id: rp.permissions.id,
            code: rp.permissions.code,
            name: rp.permissions.name,
            description: rp.permissions.description,
            is_active: rp.permissions.is_active,
          } : null,
          role: rp.role ? {
            idrole: rp.role.idrole,
            description: rp.role.description,
          } : null,
        }));

        return PaginationUtils.createPaginatedResponse(items, new PaginationParams({ page, limit }), total);
      },
    );
  }

  async findOne(id: number, useCache = true): Promise<any> {
    return this.tryCacheOrExecute(
      this.rolePermissionCacheKey,
      { id },
      useCache,
      async () => {
        const rolePermission = await ServiceCache.Database.Prisma.role_permissions.findUnique({
          where: { id },
          include: {
            permissions: true,
            role: true,
          },
        });

        if (!rolePermission) {
          throw new NotFoundException(`RolePermission with ID ${id} not found`);
        }

        return {
          ...CacheableFactory.create(rolePermission, RolePermissionModel).toJSON(),
          permission: rolePermission.permissions ? {
            id: rolePermission.permissions.id,
            code: rolePermission.permissions.code,
            name: rolePermission.permissions.name,
            description: rolePermission.permissions.description,
            is_active: rolePermission.permissions.is_active,
          } : null,
          role: rolePermission.role ? {
            idrole: rolePermission.role.idrole,
            description: rolePermission.role.description,
          } : null,
        };
      },
    );
  }

  async findByRoleId(roleId: number, useCache = true): Promise<string[]> {
    console.log('\n🔍 ========== FIND BY ROLE ID ==========');
    console.log('📌 Role ID:', roleId);
    console.log('💾 Use Cache:', useCache);
    
    const cacheKey = `by_role_${roleId}`;
    console.log('🔑 Cache Key:', cacheKey);

    return this.tryCacheOrExecute(
      this.rolePermissionCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        console.log('💽 Consultando base de datos...');
        const where: any = { role_id: roleId };

        const rolePermissions = await ServiceCache.Database.Prisma.role_permissions.findMany({
          where,
          include: {
            permissions: true,
          },
          orderBy: { id: 'asc' },
        });

        console.log('📊 Role Permissions encontrados:', rolePermissions.length);
        console.log('📋 Detalles:', JSON.stringify(rolePermissions.map(rp => ({
          id: rp.id,
          role_id: rp.role_id,
          permission_id: rp.permission_id,
          is_active: rp.is_active,
          permission_code: rp.permissions?.code
        })), null, 2));

        const permissionCodes = rolePermissions
          .map((rp) => rp.permissions?.code || null)
          .filter((code): code is string => code !== null);

        console.log('✅ Códigos de permisos retornados:', permissionCodes);
        console.log('========== FIN FIND BY ROLE ID ==========\n');

        return permissionCodes;
      },
    );
  }

  async findByPermissionId(
    permissionId: number,
    useCache = true,
  ): Promise<any[]> {
    const cacheKey = `by_permission_${permissionId}`;

    return this.tryCacheOrExecute(
      this.rolePermissionCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        const where: any = { permission_id: permissionId };

        const rolePermissions = await ServiceCache.Database.Prisma.role_permissions.findMany({
          where,
          include: {
            permissions: true,
            role: true,
          },
          orderBy: { id: 'asc' },
        });

        return rolePermissions.map((rp) => ({
          ...CacheableFactory.create(rp, RolePermissionModel).toJSON(),
          permission: rp.permissions ? {
            id: rp.permissions.id,
            code: rp.permissions.code,
            name: rp.permissions.name,
            description: rp.permissions.description,
            is_active: rp.permissions.is_active,
          } : null,
          role: rp.role ? {
            idrole: rp.role.idrole,
            description: rp.role.description,
          } : null,
        }));
      },
    );
  }

  async findByPermissionCode(
    permissionCode: string,
    useCache = true,
  ): Promise<any[]> {
    const cacheKey = `by_permission_code_${permissionCode}`;

    return this.tryCacheOrExecute(
      this.rolePermissionCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        // Buscar el permiso por código
        const permission = await this.permissionService.findByCode(permissionCode, false);

        if (!permission) {
          throw new NotFoundException(`Permission with code '${permissionCode}' not found`);
        }

        const where: any = { permission_id: permission.id };

        const rolePermissions = await ServiceCache.Database.Prisma.role_permissions.findMany({
          where,
          include: {
            permissions: true,
            role: true,
          },
          orderBy: { id: 'asc' },
        });

        return rolePermissions.map((rp) => ({
          ...CacheableFactory.create(rp, RolePermissionModel).toJSON(),
          permission: rp.permissions ? {
            id: rp.permissions.id,
            code: rp.permissions.code,
            name: rp.permissions.name,
            description: rp.permissions.description,
            is_active: rp.permissions.is_active,
          } : null,
          role: rp.role ? {
            idrole: rp.role.idrole,
            description: rp.role.description,
          } : null,
        }));
      },
    );
  }

  async update(id: number, dto: UpdateRolePermissionDto): Promise<RolePermissionModel> {
    // Verificar que el role_permission existe
    await this.findOne(id, false);

    // Si se actualiza el role_id, verificar que el rol existe en el tenant
    if (dto.role_id) {
      const role = await ServiceCache.Database.Prisma.role.findFirst({
        where: { idrole: dto.role_id },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${dto.role_id} not found`);
      }
    }

    let permissionId: number | undefined;

    // Si se actualiza el permission_code, buscar el permiso por código
    if (dto.permission_code) {
      const permission = await this.permissionService.findByCode(dto.permission_code, false);

      if (!permission) {
        throw new NotFoundException(`Permission with code '${dto.permission_code}' not found`);
      }

      permissionId = permission.id;
    }

    // Si se actualiza role_id o permission_code, verificar que no exista ya la relación
    if (dto.role_id || dto.permission_code) {
      const current = await ServiceCache.Database.Prisma.role_permissions.findUnique({
        where: { id },
      });

      const newRoleId = dto.role_id || current!.role_id;
      const newPermissionId = permissionId || current!.permission_id;

      const whereExisting: any = {
        role_id: newRoleId,
        permission_id: newPermissionId,
        id: { not: id },
      };

      const existing = await ServiceCache.Database.Prisma.role_permissions.findFirst({
        where: whereExisting,
      });

      if (existing) {
        throw new ConflictException(
          `Role ${newRoleId} already has permission with code '${dto.permission_code}'`,
        );
      }
    }

    const updated = await ServiceCache.Database.Prisma.role_permissions.update({
      where: { id },
      data: {
        ...(dto.role_id && { role_id: dto.role_id }),
        ...(permissionId && { permission_id: permissionId }),
        ...(dto.is_active !== undefined && { is_active: dto.is_active }),
      },
    });

    const model = CacheableFactory.create(updated, RolePermissionModel);

    // Actualizar cache del item
    await this.cacheSet(
      this.rolePermissionCacheKey,
      { id: updated.id },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return model;
  }

  async remove(id: number): Promise<void> {
    // Verificar que el role_permission existe
    await this.findOne(id, false);

    // En lugar de eliminar, cambiar is_active a false
    const updated = await ServiceCache.Database.Prisma.role_permissions.update({
      where: { id },
      data: { is_active: false },
    });

    const model = CacheableFactory.create(updated, RolePermissionModel);

    // Actualizar cache del item
    await this.cacheSet(
      this.rolePermissionCacheKey,
      { id: updated.id },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();
  }

  /**
   * Verifica si ya existe un rol con exactamente los mismos permisos activos
   * @param roleIdToExclude - ID del rol a excluir de la búsqueda (útil al actualizar un rol existente)
   * @param permissionIds - Array de IDs de permisos a comparar
   * @returns El rol duplicado si existe, null si no
   */
  private async findRoleWithSamePermissions(
    permissionIds: number[],
    roleIdToExclude?: number,
  ): Promise<{ idrole: number; description: string } | null> {
    // Obtener todos los roles con sus permisos activos
    const where: any = roleIdToExclude ? { idrole: { not: roleIdToExclude } } : {};
    const allRoles = await ServiceCache.Database.Prisma.role.findMany({
      where,
      include: {
        role_permissions: {
          where: { is_active: true },
          select: { permission_id: true },
        },
      },
    });

    // Normalizar los permission_ids para comparación (ordenados)
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

  async assignPermissionsToRole(
    roleId: number,
    dto: AssignPermissionsToRoleDto,
  ): Promise<RolePermissionModel[]> {
    // Verificar que el rol existe
    const role = await ServiceCache.Database.Prisma.role.findFirst({
      where: {
        idrole: roleId,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Verificar que todos los permisos existen
    const permissions = await ServiceCache.Database.Prisma.permissions.findMany({
      where: {
        id: { in: dto.permission_ids },
      },
    });

    if (permissions.length !== dto.permission_ids.length) {
      const foundIds = permissions.map((p) => p.id);
      const missingIds = dto.permission_ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Permissions not found: ${missingIds.join(', ')}`);
    }

    // Verificar que todos los permisos estén activos
    const inactivePermissions = permissions.filter((p) => !p.is_active);
    if (inactivePermissions.length > 0) {
      const inactiveCodes = inactivePermissions.map((p) => p.code).join(', ');
      throw new ConflictException(
        `Cannot assign inactive permissions: ${inactiveCodes}. Please activate them first`,
      );
    }

    // Verificar que no exista otro rol con exactamente los mismos permisos
    const duplicateRole = await this.findRoleWithSamePermissions(dto.permission_ids, roleId);
    if (duplicateRole) {
      throw new ConflictException(
        `A role with the same permission set already exists: '${duplicateRole.description}' (ID: ${duplicateRole.idrole}). Cannot assign duplicate permission configurations`,
      );
    }

    // Obtener permisos actuales del rol
    const currentRolePermissions = await ServiceCache.Database.Prisma.role_permissions.findMany({
      where: {
        role_id: roleId,
      },
    });

    const currentPermissionIds = currentRolePermissions.map((rp) => rp.permission_id);
    const newPermissionIds = dto.permission_ids;

    // Determinar qué permisos desactivar (los que están actualmente pero no en la nueva lista)
    const permissionsToDeactivate = currentPermissionIds.filter(
      (id) => !newPermissionIds.includes(id),
    );

    // Determinar qué permisos activar (los que están en la nueva lista)
    const permissionsToActivate = newPermissionIds.filter(
      (id) => currentPermissionIds.includes(id),
    );

    // Determinar qué permisos crear (los que están en la nueva lista pero no existen actualmente)
    const permissionsToCreate = newPermissionIds.filter(
      (id) => !currentPermissionIds.includes(id),
    );

    // Desactivar los permisos que ya no deben estar activos
    if (permissionsToDeactivate.length > 0) {
      await ServiceCache.Database.Prisma.role_permissions.updateMany({
        where: {
          role_id: roleId,
          permission_id: { in: permissionsToDeactivate },
        },
        data: { is_active: false },
      });
    }

    // Activar los permisos que deben estar activos
    if (permissionsToActivate.length > 0) {
      await ServiceCache.Database.Prisma.role_permissions.updateMany({
        where: {
          role_id: roleId,
          permission_id: { in: permissionsToActivate },
        },
        data: { is_active: true },
      });
    }

    // Crear solo los permisos nuevos
    if (permissionsToCreate.length > 0) {
      await ServiceCache.Database.Prisma.role_permissions.createMany({
        data: permissionsToCreate.map((permissionId) => ({
          role_id: roleId,
          permission_id: permissionId,
          is_active: true,
        })),
      });
    }

    // Obtener todos los registros finales
    const rolePermissions = await ServiceCache.Database.Prisma.role_permissions.findMany({
      where: {
        role_id: roleId,
      },
    });

    // Invalidar cache
    await this.invalidateListCaches();

    return rolePermissions.map((rp) => CacheableFactory.create(rp, RolePermissionModel));
  }

  async deactivateAllPermissionsFromRole(roleId: number): Promise<void> {
    // Verificar que el rol existe
    const role = await ServiceCache.Database.Prisma.role.findFirst({
      where: { idrole: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    await ServiceCache.Database.Prisma.role_permissions.updateMany({
      where: { role_id: roleId },
      data: { is_active: false },
    });

    // Invalidar cache
    await this.invalidateListCaches();
  }

  async removeAllPermissionsFromRole(roleId: number): Promise<void> {
    // Verificar que el rol existe
    const role = await ServiceCache.Database.Prisma.role.findFirst({
      where: { idrole: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    await ServiceCache.Database.Prisma.role_permissions.deleteMany({
      where: { role_id: roleId },
    });

    // Invalidar cache
    await this.invalidateListCaches();
  }

  private async invalidateListCaches(): Promise<void> {
    await this.cacheDelete(this.rolePermissionCacheKey, {
      key: this.rolePermissionListSuffixKey,
    });

    // Invalidar cache paginado con patrón
    const pattern = `${this.rolePermissionCacheKey}:${this.rolePermissionListSuffixKey}_paginated_*`;
    await this.cache.deletePattern(pattern);

    // Invalidar cache por role_id
    const patternByRole = `${this.rolePermissionCacheKey}:by_role_*`;
    await this.cache.deletePattern(patternByRole);

    // Invalidar cache por permission_id
    const patternByPermission = `${this.rolePermissionCacheKey}:by_permission_*`;
    await this.cache.deletePattern(patternByPermission);

    // Invalidar cache por permission_code
    const patternByPermissionCode = `${this.rolePermissionCacheKey}:by_permission_code_*`;
    await this.cache.deletePattern(patternByPermissionCode);
  }
}
