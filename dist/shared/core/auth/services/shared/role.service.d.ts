import { Role } from '../../constants/roles.enum';
import { UserAuth } from '../../interfaces/shared/user-auth.interface';
export declare class RoleService {
    validate(user: UserAuth, allowedRoles: Role[]): void;
}
