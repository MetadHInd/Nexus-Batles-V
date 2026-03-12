import { CreateModuleDto, UpdateModuleDto, BulkDeleteModuleDto } from '../dtos/module.dto';
import { ModuleModel } from '../models/module.model';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { PermissionService } from 'src/modules/permissions/services/permission.service';
export declare class ModuleService extends BasePaginatedService {
    private readonly permissionService;
    constructor(cache: RedisCacheService, permissionService: PermissionService);
    private readonly moduleCacheKey;
    private readonly moduleListSuffixKey;
    create(dto: CreateModuleDto): Promise<ModuleModel>;
    findAll(useCache?: boolean): Promise<ModuleModel[]>;
    findOne(id: number, useCache?: boolean): Promise<ModuleModel>;
    findByUuid(uuid: string, useCache?: boolean): Promise<ModuleModel>;
    update(id: number, dto: UpdateModuleDto): Promise<ModuleModel>;
    delete(id: number): Promise<void>;
    bulkDelete(dto: BulkDeleteModuleDto): Promise<{
        deleted: number;
    }>;
    private invalidateListCaches;
}
