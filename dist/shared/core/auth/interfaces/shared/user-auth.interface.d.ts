import { Role } from '../../constants/roles.enum';
import { ITokenizable } from './tokenizable.interface';
export interface UserAuth extends ITokenizable {
    usersub: string;
    email: string;
    role: Role;
    [key: string]: any;
}
