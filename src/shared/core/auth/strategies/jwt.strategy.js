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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var passport_jwt_1 = require("passport-jwt");
var service_cache_1 = require("../../services/service-cache/service-cache");
var JwtStrategy = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy);
    var JwtStrategy = _classThis = /** @class */ (function (_super) {
        __extends(JwtStrategy_1, _super);
        function JwtStrategy_1(jwtSecretProvider) {
            var _this = _super.call(this, {
                jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                    passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(), // Header Authorization: Bearer <token>
                    function (request) {
                        // Check for GuestToken header (for catering endpoints)
                        var guestToken = request.headers['guesttoken'] || request.headers['GuestToken'];
                        if (guestToken) {
                            // Handle token with or without Bearer prefix
                            var token = typeof guestToken === 'string' && guestToken.startsWith('Bearer ')
                                ? guestToken.replace('Bearer ', '')
                                : guestToken;
                            return token;
                        }
                        return null;
                    },
                    function (request) {
                        var token = null;
                        if (request && request.cookies) {
                            // Buscar en diferentes nombres de cookies
                            var cookies = request.cookies;
                            token =
                                (cookies === null || cookies === void 0 ? void 0 : cookies['auth_token']) ||
                                    (cookies === null || cookies === void 0 ? void 0 : cookies['authToken']) ||
                                    (cookies === null || cookies === void 0 ? void 0 : cookies['jwt']) ||
                                    (cookies === null || cookies === void 0 ? void 0 : cookies['access_token']) ||
                                    (cookies === null || cookies === void 0 ? void 0 : cookies['token']) ||
                                    null;
                        }
                        console.log("Found Token ".concat(token));
                        return token;
                    },
                ]),
                ignoreExpiration: false,
                secretOrKeyProvider: function (request, rawJwtToken, done) {
                    var secret = _this.jwtSecretProvider.getSecret();
                    done(null, secret);
                },
            }) || this;
            _this.jwtSecretProvider = jwtSecretProvider;
            // Manual verification for debugging
            try {
                var jwt = require('jsonwebtoken');
                // Example: use the token from the last cookie log or paste a test token here
                var testToken = process.env.TEST_JWT_TOKEN || '';
                if (testToken) {
                    var decoded = jwt.verify(testToken, process.env.JWT_SECRET);
                }
            }
            catch (err) {
                // Error verifying test token
            }
            return _this;
        }
        JwtStrategy_1.prototype.validate = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, user, userProfile_1, userResponse, error_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userId = payload.sub || payload.usersub || payload.idsysUser || payload.id;
                            if (!userId) {
                                throw new common_1.UnauthorizedException('Token inválido: falta ID de usuario');
                            }
                            // Manejo especial para usuarios invitados
                            if (payload.isGuest || payload.userType === 'guest') {
                                return [2 /*return*/, {
                                        userId: userId.toString(),
                                        uuid: userId.toString(),
                                        username: payload.name || "Guest-".concat(userId),
                                        email: payload.email || "guest-".concat(userId, "@temporary.local"),
                                        firstName: payload.name || 'Guest',
                                        lastName: '',
                                        fullName: payload.name || "Guest ".concat(userId),
                                        phoneNumber: payload.phoneNumber || null,
                                        // Rol de invitado
                                        authorizationRole: 1, // USER
                                        authorizationRoleName: 'USER',
                                        localRole: 1,
                                        localRoleName: 'Guest User',
                                        role: { id: 1, description: 'Guest User' },
                                        roleName: 'Guest User',
                                        status: 1,
                                        statusName: 'Active',
                                        branches: [],
                                        tenants: [],
                                        // Permisos mínimos para invitados
                                        permissions: {
                                            canAccessBranch: function () { return false; },
                                            canManageBranch: function () { return false; },
                                            hasRole: function () { return false; },
                                            isManager: false,
                                            managedBranches: [],
                                            accessibleBranches: [],
                                        },
                                        // Flags especiales
                                        isAIAUser: false,
                                        isSuperAdmin: false,
                                        isGlobalAdmin: false,
                                        isAssistant: false,
                                        isGuest: true,
                                        // Control de sesión
                                        sessionId: payload.sessionId,
                                        loginAt: payload.loginAt,
                                        userType: 'guest',
                                        profile: null,
                                    }];
                            }
                            // 🔥 Manejo especial para customers (usuarios de ordering online)
                            if (payload.isCustomer || payload.userType === 'customer') {
                                return [2 /*return*/, {
                                        userId: userId.toString(),
                                        uuid: userId.toString(),
                                        username: payload.name || "Customer-".concat(userId),
                                        email: payload.email || '',
                                        firstName: payload.name || 'Customer',
                                        lastName: '',
                                        fullName: payload.name || "Customer ".concat(userId),
                                        phoneNumber: payload.phoneNumber || payload.phone || null,
                                        // Rol de customer
                                        authorizationRole: 1, // USER
                                        authorizationRoleName: 'CUSTOMER',
                                        localRole: 1,
                                        localRoleName: 'Customer',
                                        role: { id: 1, description: 'Customer' },
                                        roleName: 'Customer',
                                        status: 1,
                                        statusName: 'Active',
                                        branches: [],
                                        tenants: [],
                                        // Permisos mínimos para customers
                                        permissions: {
                                            canAccessBranch: function () { return false; },
                                            canManageBranch: function () { return false; },
                                            hasRole: function () { return false; },
                                            isManager: false,
                                            managedBranches: [],
                                            accessibleBranches: [],
                                        },
                                        // Flags especiales
                                        isAIAUser: false,
                                        isSuperAdmin: false,
                                        isGlobalAdmin: false,
                                        isAssistant: false,
                                        isCustomer: true,
                                        // Control de sesión y datos del customer
                                        customerId: payload.customerId,
                                        sessionId: payload.sessionId,
                                        sessionUuid: payload.sessionUuid,
                                        userType: 'customer',
                                        // Información multi-tenant
                                        tenant_id: payload.tenant_id,
                                        profile: null,
                                    }];
                            }
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
                                    where: { idsysUser: userId },
                                    include: {
                                        role_sysUser_roleTorole: true,
                                    },
                                })];
                        case 2:
                            user = _c.sent();
                            if (!user) {
                                throw new common_1.UnauthorizedException('Usuario no encontrado');
                            }
                            userProfile_1 = {
                                userId: user.idsysUser,
                                uuid: user.uuid || '', // UUID real de la base de datos
                                email: user.userEmail || '',
                                name: user.userName,
                                lastName: user.userLastName,
                                lastname: user.userLastName, // alias para compatibilidad
                                fullName: "".concat(user.userName || '', " ").concat(user.userLastName || '').trim(),
                                role: {
                                    id: user.role,
                                    description: ((_a = user.role_sysUser_roleTorole) === null || _a === void 0 ? void 0 : _a.description) || 'User',
                                },
                                roleId: user.role,
                                roleName: ((_b = user.role_sysUser_roleTorole) === null || _b === void 0 ? void 0 : _b.description) || 'User',
                                isActive: user.is_active !== false,
                                status: user.is_active ? 1 : 0,
                                statusName: user.is_active ? 'Active' : 'Inactive',
                                branches: [], // TODO: implementar branches desde organizations/teams
                                getPermissions: function () { return ({
                                    canAccessBranch: function () { return false; },
                                    canManageBranch: function () { return false; },
                                    hasRole: function () { return false; },
                                    isManager: false,
                                    managedBranches: [],
                                    accessibleBranches: [],
                                }); },
                            };
                            // Verificar que el usuario esté activo
                            if (!userProfile_1.isActive) {
                                throw new common_1.UnauthorizedException('Usuario inactivo');
                            }
                            // Actualizar última actividad usando ServiceCache
                            return [4 /*yield*/, service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                                    where: { idsysUser: userId },
                                    data: { updated_at: new Date() },
                                })];
                        case 3:
                            // Actualizar última actividad usando ServiceCache
                            _c.sent();
                            userResponse = {
                                userId: userProfile_1.userId,
                                uuid: userProfile_1.uuid,
                                username: userProfile_1.name,
                                email: userProfile_1.email,
                                firstName: userProfile_1.name,
                                lastName: userProfile_1.lastname,
                                fullName: userProfile_1.fullName,
                                phoneNumber: user.userPhone, // Teléfono del usuario desde la BD
                                // Rol de Authorization (del JWT) - Global
                                authorizationRole: payload.role || payload.authRole || payload.authorization_role,
                                authorizationRoleName: this.getAuthorizationRoleName(payload.role || payload.authRole || payload.authorization_role),
                                // Rol Local (del sistema) - De la tabla role
                                localRole: userProfile_1.role.id,
                                localRoleName: userProfile_1.roleName,
                                // Información de rol (backward compatibility)
                                role: userProfile_1.role,
                                roleName: userProfile_1.roleName,
                                // Información de estado
                                status: userProfile_1.status,
                                statusName: userProfile_1.statusName,
                                // Información de branches
                                branches: userProfile_1.branches,
                                tenants: [],
                                // Permisos calculados - Verificación adicional de seguridad
                                permissions: (function () {
                                    try {
                                        if (userProfile_1 &&
                                            typeof userProfile_1.getPermissions === 'function') {
                                            return userProfile_1.getPermissions();
                                        }
                                        else {
                                            return {
                                                canAccessBranch: function () { return false; },
                                                canManageBranch: function () { return false; },
                                                hasRole: function () { return false; },
                                                isManager: false,
                                                managedBranches: [],
                                                accessibleBranches: [],
                                            };
                                        }
                                    }
                                    catch (error) {
                                        return {
                                            canAccessBranch: function () { return false; },
                                            canManageBranch: function () { return false; },
                                            hasRole: function () { return false; },
                                            isManager: false,
                                            managedBranches: [],
                                            accessibleBranches: [],
                                        };
                                    }
                                })(), // Verificaciones de seguridad
                                isAIAUser: userProfile_1.role.id === 5, // LocalRole.AIA
                                isSuperAdmin: (payload.role || payload.authRole || payload.authorization_role) ===
                                    5, // AuthorizationRole.SUPER_ADMIN
                                isGlobalAdmin: [4, 5, 6].includes(payload.role || payload.authRole || payload.authorization_role), // ADMIN_AUTHORIZED_ORIGIN, SUPER_ADMIN o ASSISTANT
                                isAssistant: (payload.role || payload.authRole || payload.authorization_role) ===
                                    6, // AuthorizationRole.ASSISTANT
                                // Control de sesión y tipo de usuario
                                userType: 'user',
                                sessionId: payload.sessionId,
                                sessionUuid: payload.sessionUuid,
                                loginAt: new Date().toISOString(),
                                // Información multi-tenant (si existe en el payload)
                                tenant_id: payload.tenant_id,
                                // Perfil completo para uso interno
                                profile: userProfile_1,
                            };
                            return [2 /*return*/, userResponse];
                        case 4:
                            error_1 = _c.sent();
                            throw new common_1.UnauthorizedException('Error al validar usuario');
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Mapear ID de rol de authorization a nombre legible
         */
        JwtStrategy_1.prototype.getAuthorizationRoleName = function (roleId) {
            var roleNames = {
                1: 'USER',
                2: 'ADMIN',
                3: 'SUPERVISOR',
                4: 'ADMIN_AUTHORIZED_ORIGIN',
                5: 'SUPER_ADMIN',
                6: 'ASSISTANT',
            };
            return roleNames[roleId] || 'UNKNOWN';
        };
        return JwtStrategy_1;
    }(_classSuper));
    __setFunctionName(_classThis, "JwtStrategy");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JwtStrategy = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JwtStrategy = _classThis;
}();
exports.JwtStrategy = JwtStrategy;
