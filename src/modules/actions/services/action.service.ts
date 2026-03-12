import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActionDto, UpdateActionDto, BulkDeleteActionDto } from '../dtos/action.dto';
import { ActionModel } from '../models/action.model';
import { RedisCacheService } from '../../../shared/cache/redis-cache.service';
import { BasePaginatedService } from '../../../shared/common/services/base-paginated.service';
import { ServiceCache } from '../../../shared/core/services/service-cache/service-cache';
import { CacheableFactory } from '../../../shared/cache/factories/cacheable.factory';

@Injectable()
export class ActionService extends BasePaginatedService {
  constructor(cache: RedisCacheService) {
    super(cache);
  }

  private readonly actionCacheKey = 'action';
  private readonly actionListSuffixKey = '_list';

  async create(dto: CreateActionDto): Promise<ActionModel> {
    const created = await ServiceCache.Database.Prisma.actions.create({
      data: {
        description: dto.description || null,
        slug: dto.slug || null,
      },
    });

    const model = CacheableFactory.create(created, ActionModel);

    // Actualizar cache del item creado
    await this.cacheSet(
      this.actionCacheKey,
      { id: created.id },
      model,
      model.cacheTTL(),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return model;
  }

  async findAll(useCache = true): Promise<ActionModel[]> {
    return this.tryCacheOrExecute(
      this.actionCacheKey,
      { key: this.actionListSuffixKey },
      useCache,
      async () => {
        const actions = await ServiceCache.Database.Prisma.actions.findMany({
          orderBy: { id: 'asc' },
        });

        return actions.map((action) =>
          CacheableFactory.create(action, ActionModel),
        );
      },
    );
  }

  async findOne(id: number, useCache = true): Promise<ActionModel> {
    return this.tryCacheOrExecute(
      this.actionCacheKey,
      { id },
      useCache,
      async () => {
        const action = await ServiceCache.Database.Prisma.actions.findUnique({
          where: { id },
        });

        if (!action) {
          throw new NotFoundException(`Action with ID ${id} not found`);
        }

        return CacheableFactory.create(action, ActionModel);
      },
    );
  }

  async update(id: number, dto: UpdateActionDto): Promise<ActionModel> {
    // Verificar si existe
    await this.findOne(id, false);

    const updated = await ServiceCache.Database.Prisma.actions.update({
      where: { id },
      data: dto,
    });

    const model = CacheableFactory.create(updated, ActionModel);

    // Actualizar cache del item
    await this.cacheSet(
      this.actionCacheKey,
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

    await ServiceCache.Database.Prisma.actions.delete({
      where: { id },
    });

    // Invalidar cache del item
    await this.cacheDelete(this.actionCacheKey, { id });

    // Invalidar cache de la lista
    await this.invalidateListCaches();
  }

  async bulkDelete(dto: BulkDeleteActionDto): Promise<{ deleted: number }> {
    const { ids } = dto;

    const result = await ServiceCache.Database.Prisma.actions.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    // Invalidar cache de todos los items eliminados
    await Promise.all(
      ids.map((id) => this.cacheDelete(this.actionCacheKey, { id })),
    );

    // Invalidar cache de la lista
    await this.invalidateListCaches();

    return { deleted: result.count };
  }

  private async invalidateListCaches(): Promise<void> {
    const pattern = `${this.actionCacheKey}:${this.actionListSuffixKey}*`;
    await this.cache.deletePattern(pattern);
  }
}
