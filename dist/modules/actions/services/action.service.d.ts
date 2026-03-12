import { CreateActionDto, UpdateActionDto, BulkDeleteActionDto } from '../dtos/action.dto';
import { ActionModel } from '../models/action.model';
import { RedisCacheService } from '../../../shared/cache/redis-cache.service';
import { BasePaginatedService } from '../../../shared/common/services/base-paginated.service';
export declare class ActionService extends BasePaginatedService {
    constructor(cache: RedisCacheService);
    private readonly actionCacheKey;
    private readonly actionListSuffixKey;
    create(dto: CreateActionDto): Promise<ActionModel>;
    findAll(useCache?: boolean): Promise<ActionModel[]>;
    findOne(id: number, useCache?: boolean): Promise<ActionModel>;
    update(id: number, dto: UpdateActionDto): Promise<ActionModel>;
    delete(id: number): Promise<void>;
    bulkDelete(dto: BulkDeleteActionDto): Promise<{
        deleted: number;
    }>;
    private invalidateListCaches;
}
