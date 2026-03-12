import { IUserPublic } from '../interfaces/user.interface';
import { IUserWithRole } from '../interfaces/user.interface';

export class UserPublicMapper {
  static toPublic(user: IUserWithRole): IUserPublic {
    return {
      uuid: user.uuid,
      userName: user.userName,
      userLastName: user.userLastName,
      userEmail: user.userEmail,
      role: user.role_sysUser_roleTorole
        ? {
            idrole: user.role_sysUser_roleTorole.idrole,
            description: user.role_sysUser_roleTorole.description,
          }
        : null,
    };
  }
}
