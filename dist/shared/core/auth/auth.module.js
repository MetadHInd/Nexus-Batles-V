"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const cache_module_1 = require("../../cache/cache.module");
const sse_module_1 = require("../sse/sse.module");
const auth_controller_1 = require("./controllers/auth.controller");
const users_controller_1 = require("./controllers/users.controller");
const auth_service_1 = require("./services/internal/auth.service");
const auth_service_2 = require("./services/external/auth.service");
const token_service_1 = require("./services/shared/token.service");
const password_service_1 = require("./services/shared/password.service");
const role_service_1 = require("./services/shared/role.service");
const signature_service_1 = require("./services/shared/signature.service");
const checksum_service_1 = require("./services/shared/checksum.service");
const jwt_secret_provider_1 = require("./services/shared/jwt-secret.provider");
const auth_cache_service_1 = require("./services/auth-cache.service");
const user_role_service_1 = require("./services/user-role.service");
const users_service_1 = require("./services/users.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const branch_access_guard_1 = require("./guards/branch-access.guard");
const dual_role_guard_1 = require("./guards/dual-role.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: {
                    expiresIn: (process.env.JWT_EXPIRES_IN || '24h'),
                },
            }),
            cache_module_1.CacheModule,
            sse_module_1.SSEModule,
        ],
        controllers: [auth_controller_1.AuthController, users_controller_1.UsersController],
        providers: [
            auth_service_1.InternalAuthService,
            auth_service_2.ExternalAuthService,
            token_service_1.TokenService,
            password_service_1.PasswordService,
            role_service_1.RoleService,
            signature_service_1.SignatureService,
            checksum_service_1.ChecksumService,
            jwt_secret_provider_1.JwtSecretProvider,
            auth_cache_service_1.AuthCacheService,
            user_role_service_1.UserRoleService,
            users_service_1.UsersService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            branch_access_guard_1.BranchAccessGuard,
            dual_role_guard_1.DualRoleGuard,
        ],
        exports: [
            auth_service_1.InternalAuthService,
            auth_service_2.ExternalAuthService,
            token_service_1.TokenService,
            password_service_1.PasswordService,
            role_service_1.RoleService,
            signature_service_1.SignatureService,
            checksum_service_1.ChecksumService,
            jwt_secret_provider_1.JwtSecretProvider,
            auth_cache_service_1.AuthCacheService,
            user_role_service_1.UserRoleService,
            users_service_1.UsersService,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            roles_guard_1.RolesGuard,
            branch_access_guard_1.BranchAccessGuard,
            dual_role_guard_1.DualRoleGuard,
            passport_1.PassportModule,
            jwt_1.JwtModule,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map