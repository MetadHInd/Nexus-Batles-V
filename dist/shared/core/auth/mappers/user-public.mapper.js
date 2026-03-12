"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPublicMapper = void 0;
class UserPublicMapper {
    static toPublic(user) {
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
exports.UserPublicMapper = UserPublicMapper;
//# sourceMappingURL=user-public.mapper.js.map