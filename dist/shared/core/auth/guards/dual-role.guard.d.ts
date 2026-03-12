import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationRole, LocalRole } from '../constants/roles.enum';
import { UserRoleService } from '../services/user-role.service';
export declare const DUAL_ROLES_KEY = "dualRoles";
export declare const PROTECT_AIA_KEY = "protectAIA";
export interface DualRoleConfig {
    authorizationRoles?: AuthorizationRole[];
    localRoles?: LocalRole[];
    allowSuperAdmin?: boolean;
    allowSuperUser?: boolean;
}
export declare class DualRoleGuard implements CanActivate {
    private reflector;
    private userRoleService;
    private readonly logger;
    constructor(reflector: Reflector, userRoleService: UserRoleService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private checkAIAProtection;
    private extractTargetUserId;
    private checkIfTargetIsAIAAndProtect;
}
