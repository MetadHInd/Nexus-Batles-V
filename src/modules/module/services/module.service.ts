import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateModuleDto, UpdateModuleDto, BulkDeleteModuleDto } from '../dtos/module.dto';
import { ModuleModel } from '../models/module.model';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { ServiceCache } from 'src/shared/core/services/service-cache/service-cache';
import { CacheableFactory } from 'src/shared/cache/factories/cacheable.factory';
import { PermissionService } from 'src/modules/permissions/services/permission.service';

@Injectable()
export class ModuleService extends BasePaginatedService {
  constructor(
    cache: RedisCacheService,
    private readonly permissionService: PermissionService,
  ) {
    super(cache);
  }

  private readonly moduleCacheKey = 'module';
  private readonly moduleListSuffixKey = '_list';

  async create(dto: CreateModuleDto): Promise<ModuleModel> {
    // Verificar si el nombre ya existe
    const existing = await ServiceCache.Database.Prisma.module.findFirst({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(`Module with name '${dto.name}' already exists`);
    }

    // Verificar que el módulo tenga slug si se van a crear permisos
    if (dto.action_ids && dto.action_ids.length > 0 && !dto.slug) {
      throw new ConflictException('Module must have a slug to create permissions automatically');
    }

    const created = await ServiceCache.Database.Prisma.module.create({
      data: {
        name: dto.name,
        module: dto.module,
        description: dto.description || null,
        slug: dto.slug || null,
      },
    });

    const model = CacheableFactory.create(created, ModuleModel);

    // Actualizar cache del item creado
    await this.cacheSet(
      this.moduleCacheKey,
      { id: created.id },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    // 🎯 Crear permisos automáticamente si se proporcionaron action_ids
    if (dto.action_ids && dto.action_ids.length > 0) {
      for (const actionId of dto.action_ids) {
        try {
          await this.permissionService.create({
            module_id: created.id,
            action_id: actionId,
            is_active: true,
          });
        } catch (error) {
          // Si el permiso ya existe, continuar con el siguiente
          if (error instanceof ConflictException) {
            console.log(`Permission already exists for module ${created.id} and action ${actionId}`);
            continue;
          }
          throw error;
        }
      }
    }

    return model;
  }

  async findAll(useCache = true): Promise<ModuleModel[]> {
    return this.tryCacheOrExecute(
      this.moduleCacheKey,
      { key: this.moduleListSuffixKey },
      useCache,
      async () => {
        const modules = await ServiceCache.Database.Prisma.module.findMany({
          orderBy: { name: 'asc' },
        });

        return modules.map((module) =>
          CacheableFactory.create(module, ModuleModel),
        );
      },
    );
  }

  async findOne(id: number, useCache = true): Promise<ModuleModel> {
    return this.tryCacheOrExecute(
      this.moduleCacheKey,
      { id },
      useCache,
      async () => {
        const module = await ServiceCache.Database.Prisma.module.findUnique({
          where: { id },
        });

        if (!module) {
          throw new NotFoundException(`Module with ID ${id} not found`);
        }

        return CacheableFactory.create(module, ModuleModel);
      },
    );
  }

  async findByUuid(uuid: string, useCache = true): Promise<ModuleModel> {
    return this.tryCacheOrExecute(
      this.moduleCacheKey,
      { uuid },
      useCache,
      async () => {
        const module = await ServiceCache.Database.Prisma.module.findFirst({
          where: { uuid },
        });

        if (!module) {
          throw new NotFoundException(`Module with UUID ${uuid} not found`);
        }

        return CacheableFactory.create(module, ModuleModel);
      },
    );
  }

  async update(id: number, dto: UpdateModuleDto): Promise<ModuleModel> {
    // Verificar si existe
    await this.findOne(id, false);

    // Si se actualiza el nombre, verificar que no exista otro con ese nombre
    if (dto.name) {
      const existing = await ServiceCache.Database.Prisma.module.findFirst({
        where: {
          name: dto.name,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(`Module with name '${dto.name}' already exists`);
      }
    }

    const updated = await ServiceCache.Database.Prisma.module.update({
      where: { id },
      data: dto,
    });

    const model = CacheableFactory.create(updated, ModuleModel);

    // Actualizar cache del item
    await this.cacheSet(
      this.moduleCacheKey,
      { id: updated.id },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return model;
  }

  async delete(id: number): Promise<void> {
    // Verificar si existe
    await this.findOne(id, false);

    // 1. Buscar todos los permisos asociados al módulo
    const permissions = await ServiceCache.Database.Prisma.permissions.findMany({
      where: { module_id: id },
      select: { id: true },
    });

    const permissionIds = permissions.map(p => p.id);
    console.log(`🗑️ Module ${id} has ${permissionIds.length} permissions to delete`);

    if (permissionIds.length > 0) {
      // 2. Eliminar todos los role_permissions asociados a estos permisos
      const deletedRolePermissions = await ServiceCache.Database.Prisma.role_permissions.deleteMany({
        where: {
          permission_id: { in: permissionIds },
        },
      });
      console.log(`🗑️ Deleted ${deletedRolePermissions.count} role_permissions records`);

      // 3. Eliminar todos los permisos asociados al módulo
      const deletedPermissions = await ServiceCache.Database.Prisma.permissions.deleteMany({
        where: {
          module_id: id,
        },
      });
      console.log(`🗑️ Deleted ${deletedPermissions.count} permissions`);

      // Invalidar cache de permisos
      await this.permissionService['invalidateListCaches']();
    }

    // 4. Finalmente eliminar el módulo
    await ServiceCache.Database.Prisma.module.delete({
      where: { id },
    });

    console.log(`✅ Module ${id} deleted successfully`);

    // Invalidar cache del item
    await this.cacheDelete(this.moduleCacheKey, { id });

    // Invalidar cache de la lista
    await this.invalidateListCaches();
  }

  async bulkDelete(dto: BulkDeleteModuleDto): Promise<{ deleted: number }> {
    const { ids } = dto;

    // 1. Buscar todos los permisos asociados a estos módulos
    const permissions = await ServiceCache.Database.Prisma.permissions.findMany({
      where: { module_id: { in: ids } },
      select: { id: true },
    });

    const permissionIds = permissions.map(p => p.id);
    console.log(`🗑️ Modules ${ids.join(', ')} have ${permissionIds.length} permissions to delete`);

    if (permissionIds.length > 0) {
      // 2. Eliminar todos los role_permissions asociados a estos permisos
      const deletedRolePermissions = await ServiceCache.Database.Prisma.role_permissions.deleteMany({
        where: {
          permission_id: { in: permissionIds },
        },
      });
      console.log(`🗑️ Deleted ${deletedRolePermissions.count} role_permissions records`);

      // 3. Eliminar todos los permisos asociados a estos módulos
      const deletedPermissions = await ServiceCache.Database.Prisma.permissions.deleteMany({
        where: {
          module_id: { in: ids },
        },
      });
      console.log(`🗑️ Deleted ${deletedPermissions.count} permissions`);

      // Invalidar cache de permisos
      await this.permissionService['invalidateListCaches']();
    }

    // 4. Finalmente eliminar los módulos
    const result = await ServiceCache.Database.Prisma.module.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    console.log(`✅ ${result.count} modules deleted successfully`);

    // Invalidar cache de todos los items eliminados
    await Promise.all(
      ids.map((id) => this.cacheDelete(this.moduleCacheKey, { id })),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return { deleted: result.count };
  }

  private async invalidateListCaches(): Promise<void> {
    const pattern = `${this.moduleCacheKey}:${this.moduleListSuffixKey}*`;
    await this.cache.deletePattern(pattern);
  }
}
