import { RolePermissionService } from '../services/role-permission.service';
import { CreateRolePermissionDto, UpdateRolePermissionDto, RolePermissionPaginationDto, AssignPermissionsToRoleDto } from '../dtos/role-permission.dto';
import { RolePermissionModel } from '../models/role-permission.model';
export declare class RolePermissionController {
    private readonly rolePermissionService;
    constructor(rolePermissionService: RolePermissionService);
    create(createDto: CreateRolePermissionDto): Promise<RolePermissionModel>;
    findAll(): Promise<any[]>;
    findAllPaginated(paginationDto: RolePermissionPaginationDto): Promise<import("../../../shared/common").PaginatedResponse<any>>;
    getMyPermissions(user: any): Promise<string[]>;
    findByRoleId(roleId: number): Promise<string[]>;
    findByPermissionCode(code: string): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, updateDto: UpdateRolePermissionDto): Promise<RolePermissionModel>;
    remove(id: number): Promise<void>;
    assignPermissionsToRole(roleId: number, dto: AssignPermissionsToRoleDto): Promise<RolePermissionModel[]>;
    removeAllPermissionsFromRole(roleId: number): Promise<void>;
}
