import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto, RolePaginationDto } from '../dtos/role.dto';
import { RoleModel } from '../models/role.model';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    create(createDto: CreateRoleDto): Promise<RoleModel>;
    findAll(): Promise<RoleModel[]>;
    findAllPaginated(paginationDto: RolePaginationDto): Promise<import("../../../shared/common").PaginatedResponse<RoleModel>>;
    findOne(id: number): Promise<RoleModel>;
    findByDescription(description: string): Promise<RoleModel | null>;
    update(id: number, updateDto: UpdateRoleDto): Promise<RoleModel>;
    remove(id: number): Promise<void>;
}
