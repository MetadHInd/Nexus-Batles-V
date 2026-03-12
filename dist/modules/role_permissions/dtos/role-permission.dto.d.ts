import { PaginationDto } from 'src/shared/common/dtos/pagination.dto';
export declare class CreateRolePermissionDto {
    role_id: number;
    permission_code: string;
    is_active?: boolean;
}
export declare class UpdateRolePermissionDto {
    role_id?: number;
    permission_code?: string;
    is_active?: boolean;
}
export declare class RolePermissionPaginationDto extends PaginationDto {
    role_id?: number;
    permission_code?: string;
}
export declare class AssignPermissionsToRoleDto {
    permission_ids: number[];
}
