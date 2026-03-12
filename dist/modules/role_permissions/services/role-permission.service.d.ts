import { CreateRolePermissionDto, UpdateRolePermissionDto, RolePermissionPaginationDto, AssignPermissionsToRoleDto } from '../dtos/role-permission.dto';
import { RolePermissionModel } from '../models/role-permission.model';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { PaginatedResponse } from 'src/shared/common/dtos/pagination.dto';
import { PermissionService } from 'src/modules/permissions/services/permission.service';
export declare class RolePermissionService extends BasePaginatedService {
    private readonly permissionService;
    constructor(cache: RedisCacheService, permissionService: PermissionService);
    private readonly rolePermissionCacheKey;
    private readonly rolePermissionListSuffixKey;
    private getUserRoleId;
    create(dto: CreateRolePermissionDto): Promise<RolePermissionModel>;
    findAll(useCache?: boolean): Promise<any>;
    findAllPaginated(paginationDto: RolePermissionPaginationDto, useCache?: boolean): Promise<PaginatedResponse<any>>;
    findOne(id: number, useCache?: boolean): Promise<any>;
    findByRoleId(roleId: number, useCache?: boolean): Promise<string[]>;
    findByPermissionId(permissionId: number, useCache?: boolean): Promise<any[]>;
    findByPermissionCode(permissionCode: string, useCache?: boolean): Promise<any[]>;
    update(id: number, dto: UpdateRolePermissionDto): Promise<RolePermissionModel>;
    remove(id: number): Promise<void>;
    private findRoleWithSamePermissions;
    assignPermissionsToRole(roleId: number, dto: AssignPermissionsToRoleDto): Promise<RolePermissionModel[]>;
    deactivateAllPermissionsFromRole(roleId: number): Promise<void>;
    removeAllPermissionsFromRole(roleId: number): Promise<void>;
    private invalidateListCaches;
}
