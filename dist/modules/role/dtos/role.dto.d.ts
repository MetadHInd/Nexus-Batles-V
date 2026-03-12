import { PaginationDto } from 'src/shared/common/dtos/pagination.dto';
export declare class CreateRoleDto {
    description: string;
    permission_ids?: number[];
    is_super?: boolean;
    hierarchy_level?: number;
}
export declare class UpdateRoleDto {
    description?: string;
    permission_ids?: number[];
    is_super?: boolean;
    hierarchy_level?: number;
}
export declare class RolePaginationDto extends PaginationDto {
    search?: string;
    tenant_id?: string;
}
export declare class RoleResponseDto {
    idrole: number;
    description: string | null;
    tenant_ids: string[];
    is_super: boolean | null;
    hierarchy_level: number;
}
