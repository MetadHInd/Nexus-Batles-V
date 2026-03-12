"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithAuthorization = WithAuthorization;
// src/shared/core/services/service-cache/mixins/authorization.mixin.ts
var token_service_1 = require("../../../../../../../../../../src/shared/core/auth/services/shared/token.service");
var password_service_1 = require("../../../../../../../../../../src/shared/core/auth/services/shared/password.service");
var role_service_1 = require("../../../../../../../../../../src/shared/core/auth/services/shared/role.service");
var signature_service_1 = require("../../../../../../../../../../src/shared/core/auth/services/shared/signature.service");
function WithAuthorization(Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tokenService = new token_service_1.TokenService();
            _this.passwordService = new password_service_1.PasswordService();
            _this.roleService = new role_service_1.RoleService();
            _this.signatureService = new signature_service_1.SignatureService();
            return _this;
        }
        Object.defineProperty(class_1.prototype, "Authorization", {
            // public readonly checksumService = new ChecksumService(
            //   new SignatureService(),
            // );
            // Nota: ChecksumService debe ser inyectado por NestJS donde se necesite.
            // NOTA: InternalAuthService y ExternalAuthService son servicios de NestJS 
            // con @Injectable() y deben ser inyectados, no instanciados directamente
            // public readonly internal = new InternalAuthService();
            // public readonly external = new ExternalAuthService();
            get: function () {
                return {
                    TokenService: this.tokenService,
                    PasswordService: this.passwordService,
                    RoleService: this.roleService,
                    SignatureService: this.signatureService,
                    // ChecksumService: this.checksumService, // Debe ser inyectado donde se necesite
                    // Internal: this.internal, // Debe ser inyectado por NestJS
                    // External: this.external, // Debe ser inyectado por NestJS
                };
            },
            enumerable: false,
            configurable: true
        });
        return class_1;
    }(Base));
}
