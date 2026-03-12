"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const service_cache_1 = require("../../services/service-cache/service-cache");
const jwt_secret_provider_1 = require("../services/shared/jwt-secret.provider");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    jwtSecretProvider;
    constructor(jwtSecretProvider) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request) => {
                    const guestToken = request.headers['guesttoken'] || request.headers['GuestToken'];
                    if (guestToken) {
                        const token = typeof guestToken === 'string' && guestToken.startsWith('Bearer ')
                            ? guestToken.replace('Bearer ', '')
                            : guestToken;
                        return token;
                    }
                    return null;
                },
                (request) => {
                    let token = null;
                    if (request && request.cookies) {
                        const cookies = request.cookies;
                        token =
                            cookies?.['auth_token'] ||
                                cookies?.['authToken'] ||
                                cookies?.['jwt'] ||
                                cookies?.['access_token'] ||
                                cookies?.['token'] ||
                                null;
                    }
                    console.log(`Found Token ${token}`);
                    return token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKeyProvider: (request, rawJwtToken, done) => {
                const secret = this.jwtSecretProvider.getSecret();
                done(null, secret);
            },
        });
        this.jwtSecretProvider = jwtSecretProvider;
        try {
            const jwt = require('jsonwebtoken');
            const testToken = process.env.TEST_JWT_TOKEN || '';
            if (testToken) {
                const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
            }
        }
        catch (err) {
        }
    }
    async validate(payload) {
        const userId = payload.sub || payload.usersub || payload.idsysUser || payload.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('Token inválido: falta ID de usuario');
        }
        if (payload.isGuest || payload.userType === 'guest') {
            return {
                userId: userId.toString(),
                uuid: userId.toString(),
                username: payload.name || `Guest-${userId}`,
                email: payload.email || `guest-${userId}@temporary.local`,
                firstName: payload.name || 'Guest',
                lastName: '',
                fullName: payload.name || `Guest ${userId}`,
                phoneNumber: payload.phoneNumber || null,
                authorizationRole: 1,
                authorizationRoleName: 'USER',
                localRole: 1,
                localRoleName: 'Guest User',
                role: { id: 1, description: 'Guest User' },
                roleName: 'Guest User',
                status: 1,
                statusName: 'Active',
                branches: [],
                tenants: [],
                permissions: {
                    canAccessBranch: () => false,
                    canManageBranch: () => false,
                    hasRole: () => false,
                    isManager: false,
                    managedBranches: [],
                    accessibleBranches: [],
                },
                isAIAUser: false,
                isSuperAdmin: false,
                isGlobalAdmin: false,
                isAssistant: false,
                isGuest: true,
                sessionId: payload.sessionId,
                loginAt: payload.loginAt,
                userType: 'guest',
                profile: null,
            };
        }
        if (payload.isCustomer || payload.userType === 'customer') {
            return {
                userId: userId.toString(),
                uuid: userId.toString(),
                username: payload.name || `Customer-${userId}`,
                email: payload.email || '',
                firstName: payload.name || 'Customer',
                lastName: '',
                fullName: payload.name || `Customer ${userId}`,
                phoneNumber: payload.phoneNumber || payload.phone || null,
                authorizationRole: 1,
                authorizationRoleName: 'CUSTOMER',
                localRole: 1,
                localRoleName: 'Customer',
                role: { id: 1, description: 'Customer' },
                roleName: 'Customer',
                status: 1,
                statusName: 'Active',
                branches: [],
                tenants: [],
                permissions: {
                    canAccessBranch: () => false,
                    canManageBranch: () => false,
                    hasRole: () => false,
                    isManager: false,
                    managedBranches: [],
                    accessibleBranches: [],
                },
                isAIAUser: false,
                isSuperAdmin: false,
                isGlobalAdmin: false,
                isAssistant: false,
                isCustomer: true,
                customerId: payload.customerId,
                sessionId: payload.sessionId,
                sessionUuid: payload.sessionUuid,
                userType: 'customer',
                tenant_id: payload.tenant_id,
                profile: null,
            };
        }
        try {
            const user = await service_cache_1.ServiceCache.Database.Prisma.sysUser.findUnique({
                where: { idsysUser: userId },
                include: {
                    role_sysUser_roleTorole: true,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Usuario no encontrado');
            }
            const userProfile = {
                userId: user.idsysUser,
                uuid: user.uuid || '',
                email: user.userEmail || '',
                name: user.userName,
                lastName: user.userLastName,
                lastname: user.userLastName,
                fullName: `${user.userName || ''} ${user.userLastName || ''}`.trim(),
                role: {
                    id: user.role,
                    description: user.role_sysUser_roleTorole?.description || 'User',
                },
                roleId: user.role,
                roleName: user.role_sysUser_roleTorole?.description || 'User',
                isActive: user.is_active !== false,
                status: user.is_active ? 1 : 0,
                statusName: user.is_active ? 'Active' : 'Inactive',
                branches: [],
                getPermissions: () => ({
                    canAccessBranch: () => false,
                    canManageBranch: () => false,
                    hasRole: () => false,
                    isManager: false,
                    managedBranches: [],
                    accessibleBranches: [],
                }),
            };
            if (!userProfile.isActive) {
                throw new common_1.UnauthorizedException('Usuario inactivo');
            }
            await service_cache_1.ServiceCache.Database.Prisma.sysUser.update({
                where: { idsysUser: userId },
                data: { updated_at: new Date() },
            });
            const userResponse = {
                userId: userProfile.userId,
                uuid: userProfile.uuid,
                username: userProfile.name,
                email: userProfile.email,
                firstName: userProfile.name,
                lastName: userProfile.lastname,
                fullName: userProfile.fullName,
                phoneNumber: user.userPhone,
                authorizationRole: payload.role || payload.authRole || payload.authorization_role,
                authorizationRoleName: this.getAuthorizationRoleName(payload.role || payload.authRole || payload.authorization_role),
                localRole: userProfile.role.id,
                localRoleName: userProfile.roleName,
                role: userProfile.role,
                roleName: userProfile.roleName,
                status: userProfile.status,
                statusName: userProfile.statusName,
                branches: userProfile.branches,
                tenants: [],
                permissions: (() => {
                    try {
                        if (userProfile &&
                            typeof userProfile.getPermissions === 'function') {
                            return userProfile.getPermissions();
                        }
                        else {
                            return {
                                canAccessBranch: () => false,
                                canManageBranch: () => false,
                                hasRole: () => false,
                                isManager: false,
                                managedBranches: [],
                                accessibleBranches: [],
                            };
                        }
                    }
                    catch (error) {
                        return {
                            canAccessBranch: () => false,
                            canManageBranch: () => false,
                            hasRole: () => false,
                            isManager: false,
                            managedBranches: [],
                            accessibleBranches: [],
                        };
                    }
                })(),
                isAIAUser: userProfile.role.id === 5,
                isSuperAdmin: (payload.role || payload.authRole || payload.authorization_role) ===
                    5,
                isGlobalAdmin: [4, 5, 6].includes(payload.role || payload.authRole || payload.authorization_role),
                isAssistant: (payload.role || payload.authRole || payload.authorization_role) ===
                    6,
                userType: 'user',
                sessionId: payload.sessionId,
                sessionUuid: payload.sessionUuid,
                loginAt: new Date().toISOString(),
                tenant_id: payload.tenant_id,
                profile: userProfile,
            };
            return userResponse;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Error al validar usuario');
        }
    }
    getAuthorizationRoleName(roleId) {
        const roleNames = {
            1: 'USER',
            2: 'ADMIN',
            3: 'SUPERVISOR',
            4: 'ADMIN_AUTHORIZED_ORIGIN',
            5: 'SUPER_ADMIN',
            6: 'ASSISTANT',
        };
        return roleNames[roleId] || 'UNKNOWN';
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_secret_provider_1.JwtSecretProvider])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map