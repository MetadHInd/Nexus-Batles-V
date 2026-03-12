"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = require("@nestjs/axios");
var passport_1 = require("@nestjs/passport");
var jwt_1 = require("@nestjs/jwt");
var cache_module_1 = require("../../cache/cache.module");
var sse_module_1 = require("../sse/sse.module");
// Controllers
var auth_controller_1 = require("./controllers/auth.controller");
var users_controller_1 = require("./controllers/users.controller");
// Services
var auth_service_1 = require("./services/internal/auth.service");
var auth_service_2 = require("./services/external/auth.service");
var token_service_1 = require("./services/shared/token.service");
var password_service_1 = require("./services/shared/password.service");
var role_service_1 = require("./services/shared/role.service");
var signature_service_1 = require("./services/shared/signature.service");
var checksum_service_1 = require("./services/shared/checksum.service");
var jwt_secret_provider_1 = require("./services/shared/jwt-secret.provider");
var auth_cache_service_1 = require("./services/auth-cache.service");
var user_role_service_1 = require("./services/user-role.service");
var users_service_1 = require("./services/users.service");
// Strategies
var jwt_strategy_1 = require("./strategies/jwt.strategy");
// Guards
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
var roles_guard_1 = require("./guards/roles.guard");
var branch_access_guard_1 = require("./guards/branch-access.guard");
var dual_role_guard_1 = require("./guards/dual-role.guard");
var AuthModule = function () {
    var _classDecorators = [(0, common_1.Module)({
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
                // Auth Services
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
                // Strategies
                jwt_strategy_1.JwtStrategy,
                // Guards
                jwt_auth_guard_1.JwtAuthGuard,
                roles_guard_1.RolesGuard,
                branch_access_guard_1.BranchAccessGuard,
                dual_role_guard_1.DualRoleGuard,
            ],
            exports: [
                // Auth Services
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
                // Strategies
                jwt_strategy_1.JwtStrategy,
                // Guards
                jwt_auth_guard_1.JwtAuthGuard,
                roles_guard_1.RolesGuard,
                branch_access_guard_1.BranchAccessGuard,
                dual_role_guard_1.DualRoleGuard,
                // Modules
                passport_1.PassportModule,
                jwt_1.JwtModule,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthModule = _classThis = /** @class */ (function () {
        function AuthModule_1() {
        }
        return AuthModule_1;
    }());
    __setFunctionName(_classThis, "AuthModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthModule = _classThis;
}();
exports.AuthModule = AuthModule;
