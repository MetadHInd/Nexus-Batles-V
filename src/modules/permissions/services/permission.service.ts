import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePermissionDto, UpdatePermissionDto, PermissionPaginationDto } from '../dtos/permission.dto';
import { PermissionModel } from '../models/permission.model';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { ServiceCache } from 'src/shared/core/services/service-cache/service-cache';
import { CacheableFactory } from 'src/shared/cache/factories/cacheable.factory';
import { PaginatedResponse, PaginationParams } from 'src/shared/common/dtos/pagination.dto';
import { PaginationUtils } from 'src/shared/common/utils/pagination.utils';

@Injectable()
export class PermissionService extends BasePaginatedService {
  constructor(cache: RedisCacheService) {
    super(cache);
  }

  private readonly permissionCacheKey = 'permission';
  private readonly permissionListSuffixKey = '_list';

  async create(dto: CreatePermissionDto): Promise<PermissionModel> {
    // Verificar que el module_id existe y obtener su slug
    const moduleExists = await ServiceCache.Database.Prisma.module.findUnique({
      where: { id: dto.module_id },
    });

    if (!moduleExists) {
      throw new NotFoundException(`Module with ID ${dto.module_id} not found`);
    }

    if (!moduleExists.slug) {
      throw new ConflictException(`Module with ID ${dto.module_id} does not have a slug defined`);
    }

    // Verificar que el action_id existe y obtener su slug y description
    const actionExists = await ServiceCache.Database.Prisma.actions.findUnique({
      where: { id: dto.action_id },
    });

    if (!actionExists) {
      throw new NotFoundException(`Action with ID ${dto.action_id} not found`);
    }

    if (!actionExists.slug) {
      throw new ConflictException(`Action with ID ${dto.action_id} does not have a slug defined`);
    }

    // Generar el código automáticamente: slugAction:slugModule
    const generatedCode = `${actionExists.slug}:${moduleExists.slug}`;

    // Generar el nombre automáticamente: action.description + module.slug
    const generatedName = `${actionExists.description || actionExists.slug} ${moduleExists.slug}`;

    // Verificar si el código generado ya existe
    const existing = await ServiceCache.Database.Prisma.permissions.findFirst({
      where: { code: generatedCode },
    });

    if (existing) {
      throw new ConflictException(
        `Permission with code '${generatedCode}' already exists (module: ${moduleExists.slug}, action: ${actionExists.slug})`,
      );
    }

    const created = await ServiceCache.Database.Prisma.permissions.create({
      data: {
        code: generatedCode,
        name: dto.name || generatedName,
        description: dto.description || null,
        is_active: dto.is_active ?? true,
        action_id: dto.action_id,
        module_id: dto.module_id,
      },
    });

    const model = CacheableFactory.create(created, PermissionModel);

    // Actualizar cache del item creado
    await this.cacheSet(
      this.permissionCacheKey,
      { id: created.id },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    // Crear automáticamente role_permissions para todos los roles en todos los tenants
    await this.createRolePermissionsForNewPermission(created.id);

    return model;
  }

  async findAll(useCache = true): Promise<PermissionModel[]> {
    return this.tryCacheOrExecute(
      this.permissionCacheKey,
      { key: this.permissionListSuffixKey },
      useCache,
      async () => {
        const permissions = await ServiceCache.Database.Prisma.permissions.findMany({
          orderBy: { code: 'asc' },
        });

        return permissions.map((permission) =>
          CacheableFactory.create(permission, PermissionModel),
        );
      },
    );
  }

  async findAllPaginated(
    paginationDto: PermissionPaginationDto,
    useCache = true,
  ): Promise<PaginatedResponse<PermissionModel>> {
    const { page = 1, limit = 10, is_active, search } = paginationDto;

    const cacheKey = `${this.permissionListSuffixKey}_paginated_${page}_${limit}_${is_active}_${search}`;

    return this.tryCacheOrExecute(
      this.permissionCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        const where: any = {};

        if (is_active !== undefined) {
          where.is_active = is_active;
        }

        if (search) {
          where.OR = [
            { code: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ];
        }

        const [permissions, total] = await Promise.all([
          ServiceCache.Database.Prisma.permissions.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { code: 'asc' },
          }),
          ServiceCache.Database.Prisma.permissions.count({ where }),
        ]);

        const items = permissions.map((permission) =>
          CacheableFactory.create(permission, PermissionModel),
        );

        return PaginationUtils.createPaginatedResponse(items, new PaginationParams({ page, limit }), total);
      },
    );
  }

  async findOne(id: number, useCache = true): Promise<PermissionModel> {
    return this.tryCacheOrExecute(
      this.permissionCacheKey,
      { id },
      useCache,
      async () => {
        const permission = await ServiceCache.Database.Prisma.permissions.findUnique({
          where: { id },
        });

        if (!permission) {
          throw new NotFoundException(`Permission with ID ${id} not found`);
        }

        return CacheableFactory.create(permission, PermissionModel);
      },
    );
  }

  async findByCode(code: string, useCache = true): Promise<PermissionModel | null> {
    const cacheKey = `by_code_${code}`;

    return this.tryCacheOrExecute(
      this.permissionCacheKey,
      { key: cacheKey },
      useCache,
      async () => {
        const permission = await ServiceCache.Database.Prisma.permissions.findFirst({
          where: { code },
        });

        if (!permission) {
          return null;
        }

        return CacheableFactory.create(permission, PermissionModel);
      },
    );
  }

  async update(id: number, dto: UpdatePermissionDto): Promise<PermissionModel> {
    // Verificar que el permiso existe
    const currentPermission = await this.findOne(id, false);

    let newCode: string | undefined;

    // Si se actualiza module_id o action_id, regenerar el código
    if (dto.module_id || dto.action_id) {
      const moduleId = dto.module_id ?? currentPermission.module_id;
      const actionId = dto.action_id ?? currentPermission.action_id;

      // Verificar que el module existe y tiene slug
      const moduleExists = await ServiceCache.Database.Prisma.module.findUnique({
        where: { id: moduleId },
      });

      if (!moduleExists) {
        throw new NotFoundException(`Module with ID ${moduleId} not found`);
      }

      if (!moduleExists.slug) {
        throw new ConflictException(`Module with ID ${moduleId} does not have a slug defined`);
      }

      // Verificar que el action existe y tiene slug
      if (!actionId) {
        throw new ConflictException(`Action ID is required to generate permission code`);
      }

      const actionExists = await ServiceCache.Database.Prisma.actions.findUnique({
        where: { id: actionId },
      });

      if (!actionExists) {
        throw new NotFoundException(`Action with ID ${actionId} not found`);
      }

      if (!actionExists.slug) {
        throw new ConflictException(`Action with ID ${actionId} does not have a slug defined`);
      }

      // Generar nuevo código: action:module
      newCode = `${actionExists.slug}:${moduleExists.slug}`;

      // Verificar que el nuevo código no exista (excepto el actual)
      if (newCode !== currentPermission.code) {
        const existing = await ServiceCache.Database.Prisma.permissions.findFirst({
          where: {
            code: newCode,
            id: { not: id },
          },
        });

        if (existing) {
          throw new ConflictException(
            `Permission with code '${newCode}' already exists (module: ${moduleExists.slug}, action: ${actionExists.slug})`,
          );
        }
      }
    }

    const updated = await ServiceCache.Database.Prisma.permissions.update({
      where: { id },
      data: {
        ...(newCode && { code: newCode }),
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.is_active !== undefined && { is_active: dto.is_active }),
        ...(dto.action_id !== undefined && { action_id: dto.action_id }),
        ...(dto.module_id !== undefined && { module_id: dto.module_id }),
      },
    });

    const model = CacheableFactory.create(updated, PermissionModel);

    // Actualizar cache del item
    await this.cacheSet(
      this.permissionCacheKey,
      { id: updated.id },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return model;
  }

  async remove(id: number): Promise<void> {
    // Verificar que el permiso existe
    await this.findOne(id, false);

    // Verificar si tiene role_permissions asociados
    const rolePermissions = await ServiceCache.Database.Prisma.role_permissions.count({
      where: { permission_id: id },
    });

    if (rolePermissions > 0) {
      throw new ConflictException(
        `Cannot delete permission with ID ${id} because it has ${rolePermissions} role(s) associated`,
      );
    }

    await ServiceCache.Database.Prisma.permissions.delete({
      where: { id },
    });

    // Invalidar cache
    await this.cacheDelete(this.permissionCacheKey, { id });
    await this.invalidateListCaches();
  }

  /**
   * Crea automáticamente registros en role_permissions para todos los roles
   * @param permissionId - ID del permiso recién creado
   */
  private async createRolePermissionsForNewPermission(permissionId: number): Promise<void> {
    // Buscar todos los roles
    const allRoles = await ServiceCache.Database.Prisma.role.findMany({
      select: {
        idrole: true,
        description: true,
        is_super: true,
      },
    });

    console.log(`🔍 Found ${allRoles.length} roles to process`);

    // Preparar los registros a crear
    const rolePermissionsToCreate: Array<{
      role_id: number;
      permission_id: number;
      is_active: boolean;
    }> = [];

    // Para cada rol, crear un registro
    for (const role of allRoles) {
      const recordToCreate = {
        role_id: role.idrole,
        permission_id: permissionId,
        is_active: role.is_super === true, // Solo activo si es super role
      };

      console.log(`  ➕ Preparing record: role_id=${recordToCreate.role_id}, permission_id=${recordToCreate.permission_id}, is_active=${recordToCreate.is_active}`);
      rolePermissionsToCreate.push(recordToCreate);
    }

    console.log(`📦 Prepared ${rolePermissionsToCreate.length} role_permissions to create`);
    console.log(`📊 Breakdown: ${JSON.stringify(rolePermissionsToCreate, null, 2)}`);

    // Crear todos los registros en batch
    if (rolePermissionsToCreate.length > 0) {
      // 🔍 Verificar qué registros ya existen
      const existingRecords = await ServiceCache.Database.Prisma.role_permissions.findMany({
        where: {
          permission_id: permissionId,
        },
        select: {
          id: true,
          role_id: true,
          permission_id: true,
          is_active: true,
        },
      });

      console.log(`🔍 Found ${existingRecords.length} existing role_permissions for permission ${permissionId}:`);
      if (existingRecords.length > 0) {
        console.log(JSON.stringify(existingRecords, null, 2));
      }

      try {
        const result = await ServiceCache.Database.Prisma.role_permissions.createMany({
          data: rolePermissionsToCreate,
          skipDuplicates: true,
        });

        console.log(`✅ Successfully created ${result.count} role_permissions for permission ${permissionId}`);
        
        if (result.count !== rolePermissionsToCreate.length) {
          console.warn(`⚠️ WARNING: Prepared ${rolePermissionsToCreate.length} but only created ${result.count}. This means ${rolePermissionsToCreate.length - result.count} were skipped as duplicates.`);
          
          // Verificar nuevamente después de la creación
          const afterCreate = await ServiceCache.Database.Prisma.role_permissions.findMany({
            where: {
              permission_id: permissionId,
            },
            select: {
              id: true,
              role_id: true,
              permission_id: true,
              is_active: true,
            },
          });
          console.log(`📊 After creation, total records for permission ${permissionId}: ${afterCreate.length}`);
          console.log(JSON.stringify(afterCreate, null, 2));
        }
      } catch (error) {
        console.error(`❌ Error creating role_permissions:`, error);
        throw error;
      }
    }
  }

  private async invalidateListCaches(): Promise<void> {
    await this.cacheDelete(this.permissionCacheKey, {
      key: this.permissionListSuffixKey,
    });

    // Invalidar cache paginado con patrón
    const pattern = `${this.permissionCacheKey}:${this.permissionListSuffixKey}_paginated_*`;
    await this.cache.deletePattern(pattern);

    // Invalidar cache por código
    const patternByCode = `${this.permissionCacheKey}:by_code_*`;
    await this.cache.deletePattern(patternByCode);
  }
}
