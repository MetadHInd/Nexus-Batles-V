import { PaginationDto } from 'src/shared/common/dtos/pagination.dto';
export declare class CreatePermissionDto {
    name?: string;
    description?: string;
    is_active?: boolean;
    action_id: number;
    module_id: number;
}
export declare class UpdatePermissionDto {
    code?: string;
    name?: string;
    description?: string;
    is_active?: boolean;
    action_id?: number;
    module_id?: number;
}
export declare class PermissionPaginationDto extends PaginationDto {
    is_active?: boolean;
    search?: string;
}
