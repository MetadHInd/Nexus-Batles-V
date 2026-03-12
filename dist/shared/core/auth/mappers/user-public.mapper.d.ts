import { IUserPublic } from '../interfaces/user.interface';
import { IUserWithRole } from '../interfaces/user.interface';
export declare class UserPublicMapper {
    static toPublic(user: IUserWithRole): IUserPublic;
}
