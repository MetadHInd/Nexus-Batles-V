import { UsersService } from '../services/users.service';
import { ListUsersDto } from '../dtos/list-users.dto';
import { UpdateUserDto, ChangePasswordDto } from '../dtos/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    listUsers(dto: ListUsersDto): Promise<import("../../../common").PaginatedResponse<any>>;
    getUserById(id: number): Promise<any>;
    getUserByUuid(uuid: string): Promise<any>;
    updateUser(id: number, dto: UpdateUserDto): Promise<any>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
    changePassword(id: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
