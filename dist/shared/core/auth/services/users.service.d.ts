import { BasePaginatedService } from 'src/shared/common/services/base-paginated.service';
import { RedisCacheService } from 'src/shared/cache/redis-cache.service';
import { ListUsersDto } from '../dtos/list-users.dto';
import { UpdateUserDto, ChangePasswordDto } from '../dtos/update-user.dto';
import { PaginatedResponse } from 'src/shared/common/dtos/pagination.dto';
export declare class UsersService extends BasePaginatedService {
    constructor(cache: RedisCacheService);
    listUsers(dto: ListUsersDto): Promise<PaginatedResponse<any>>;
    getUserByUuid(uuid: string): Promise<any>;
    getUserById(id: number): Promise<any>;
    updateUser(id: number, dto: UpdateUserDto): Promise<any>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
    changePassword(id: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private invalidateUserCaches;
    private mapUserRole;
}
