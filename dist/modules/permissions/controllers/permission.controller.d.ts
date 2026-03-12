import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionPaginationDto } from '../dtos/permission.dto';
import { PermissionModel } from '../models/permission.model';
export declare class PermissionController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    create(createDto: CreatePermissionDto): Promise<PermissionModel>;
    findAll(): Promise<PermissionModel[]>;
    findAllPaginated(paginationDto: PermissionPaginationDto): Promise<import("../../../shared/common").PaginatedResponse<PermissionModel>>;
    findOne(id: number): Promise<PermissionModel>;
    findByCode(code: string): Promise<PermissionModel | null>;
    update(id: number, updateDto: UpdatePermissionDto): Promise<PermissionModel>;
    remove(id: number): Promise<void>;
}
