import { AuthorizationRole, LocalRole } from '../constants/roles.enum';
export declare const DUAL_ROLES_KEY = "dualRoles";
export declare const PROTECT_AIA_KEY = "protectAIA";
export interface DualRoleConfig {
    authorizationRoles?: AuthorizationRole[];
    localRoles?: LocalRole[];
    allowSuperAdmin?: boolean;
    allowSuperUser?: boolean;
}
export declare const RequireDualRoles: (config: DualRoleConfig) => import("@nestjs/common").CustomDecorator<string>;
export declare const ProtectAIAUsers: () => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireAuthorizationRole: (...roles: AuthorizationRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireLocalRole: (...roles: LocalRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const SuperAdminOnly: () => import("@nestjs/common").CustomDecorator<string>;
export declare const GlobalAdminOnly: () => import("@nestjs/common").CustomDecorator<string>;
export declare const ManagersOnly: () => import("@nestjs/common").CustomDecorator<string>;
export declare const AIAProtected: () => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireDualRolesAndProtectAIA: (config: DualRoleConfig) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
