import { CreatePermissionDto, UpdatePermissionDto, PermissionPaginationDto } from '../dtos/permission.dto';
import { PermissionModel } from '../models/permission.model';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { PaginatedResponse } from 'src/shared/common/dtos/pagination.dto';
export declare class PermissionService extends BasePaginatedService {
    constructor(cache: RedisCacheService);
    private readonly permissionCacheKey;
    private readonly permissionListSuffixKey;
    create(dto: CreatePermissionDto): Promise<PermissionModel>;
    findAll(useCache?: boolean): Promise<PermissionModel[]>;
    findAllPaginated(paginationDto: PermissionPaginationDto, useCache?: boolean): Promise<PaginatedResponse<PermissionModel>>;
    findOne(id: number, useCache?: boolean): Promise<PermissionModel>;
    findByCode(code: string, useCache?: boolean): Promise<PermissionModel | null>;
    update(id: number, dto: UpdatePermissionDto): Promise<PermissionModel>;
    remove(id: number): Promise<void>;
    private createRolePermissionsForNewPermission;
    private invalidateListCaches;
}
