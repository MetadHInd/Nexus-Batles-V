"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithAuthorization = WithAuthorization;
const token_service_1 = require("../../../auth/services/shared/token.service");
const password_service_1 = require("../../../auth/services/shared/password.service");
const role_service_1 = require("../../../auth/services/shared/role.service");
const signature_service_1 = require("../../../auth/services/shared/signature.service");
function WithAuthorization(Base) {
    return class extends Base {
        tokenService = new token_service_1.TokenService();
        passwordService = new password_service_1.PasswordService();
        roleService = new role_service_1.RoleService();
        signatureService = new signature_service_1.SignatureService();
        get Authorization() {
            return {
                TokenService: this.tokenService,
                PasswordService: this.passwordService,
                RoleService: this.roleService,
                SignatureService: this.signatureService,
            };
        }
    };
}
//# sourceMappingURL=authorization.mixin.js.map