import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleModel } from '../models/role.model';
export declare class RolesService {
    private readonly logger;
    create(createRoleDto: CreateRoleDto): Promise<RoleModel>;
    findAll(): Promise<RoleModel[]>;
    findOne(id: number): Promise<RoleModel>;
    update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleModel>;
    remove(id: number): Promise<void>;
    findByDescription(description: string): Promise<RoleModel>;
}
