import { PaginationDto } from 'src/shared/common/dtos/pagination.dto';
export declare class ListUsersDto extends PaginationDto {
    userEmail?: string;
    userName?: string;
    role_idrole?: number;
    is_active?: boolean;
    search?: string;
}
