"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.LocalRole = exports.AuthorizationRole = void 0;
var AuthorizationRole;
(function (AuthorizationRole) {
    AuthorizationRole[AuthorizationRole["ADMIN"] = 1] = "ADMIN";
    AuthorizationRole[AuthorizationRole["USER"] = 2] = "USER";
    AuthorizationRole[AuthorizationRole["SUPERVISOR"] = 3] = "SUPERVISOR";
    AuthorizationRole[AuthorizationRole["ADMIN_AUTHORIZED_ORIGIN"] = 4] = "ADMIN_AUTHORIZED_ORIGIN";
    AuthorizationRole[AuthorizationRole["SUPER_ADMIN"] = 5] = "SUPER_ADMIN";
    AuthorizationRole[AuthorizationRole["ASSISTANT"] = 6] = "ASSISTANT";
})(AuthorizationRole || (exports.AuthorizationRole = AuthorizationRole = {}));
var LocalRole;
(function (LocalRole) {
    LocalRole[LocalRole["OWNER"] = 1] = "OWNER";
    LocalRole[LocalRole["REGIONAL_MANAGER"] = 2] = "REGIONAL_MANAGER";
    LocalRole[LocalRole["MANAGER"] = 3] = "MANAGER";
    LocalRole[LocalRole["COLLABORATOR"] = 4] = "COLLABORATOR";
    LocalRole[LocalRole["AIA"] = 5] = "AIA";
})(LocalRole || (exports.LocalRole = LocalRole = {}));
var Role;
(function (Role) {
    Role[Role["ADMIN"] = 1] = "ADMIN";
    Role[Role["USER"] = 2] = "USER";
    Role[Role["SUPERVISOR"] = 3] = "SUPERVISOR";
    Role[Role["ADMIN_AUTHORIZED_ORIGIN"] = 4] = "ADMIN_AUTHORIZED_ORIGIN";
    Role[Role["SUPER_ADMIN"] = 5] = "SUPER_ADMIN";
    Role[Role["ASSISTANT"] = 6] = "ASSISTANT";
})(Role || (exports.Role = Role = {}));
//# sourceMappingURL=roles.enum.js.map