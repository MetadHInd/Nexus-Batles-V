import { RolesService } from '../services/roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<import("..").RoleModel>;
    findAll(): Promise<import("..").RoleModel[]>;
    findOne(id: number): Promise<import("..").RoleModel>;
    update(id: number, updateRoleDto: UpdateRoleDto): Promise<import("..").RoleModel>;
    remove(id: number): Promise<void>;
    findByDescription(description: string): Promise<import("..").RoleModel>;
}
