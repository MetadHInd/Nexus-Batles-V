import { CreateRoleDto, UpdateRoleDto, RolePaginationDto } from '../dtos/role.dto';
import { RoleModel } from '../models/role.model';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { PaginatedResponse } from 'src/shared/common/dtos/pagination.dto';
import { RolePermissionService } from 'src/modules/role_permissions/services/role-permission.service';
import { PermissionService } from 'src/modules/permissions/services/permission.service';
export declare class RoleService extends BasePaginatedService {
    private readonly rolePermissionService;
    private readonly permissionService;
    constructor(cache: RedisCacheService, rolePermissionService: RolePermissionService, permissionService: PermissionService);
    private readonly roleCacheKey;
    private readonly roleListSuffixKey;
    private getTenantId;
    private getTenantIdOrFail;
    private getUserRoleId;
    private getUserHierarchy;
    private validateHierarchy;
    private checkForDuplicateRolePermissions;
    create(dto: CreateRoleDto): Promise<RoleModel>;
    findAll(useCache?: boolean): Promise<RoleModel[]>;
    findAllPaginated(paginationDto: RolePaginationDto, useCache?: boolean): Promise<PaginatedResponse<RoleModel>>;
    findOne(id: number, useCache?: boolean): Promise<RoleModel>;
    findByDescription(description: string, useCache?: boolean): Promise<RoleModel | null>;
    update(id: number, dto: UpdateRoleDto): Promise<RoleModel>;
    remove(id: number): Promise<void>;
    private invalidateListCaches;
}
