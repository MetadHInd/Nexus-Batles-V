import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationRole } from '../constants/roles.enum';
export interface UserWithAuthRole {
    authorizationRole?: AuthorizationRole;
    [key: string]: any;
}
export declare function isSystemAdmin(user: UserWithAuthRole): boolean;
export declare function canBypassForSystemAdmin(context: ExecutionContext, reflector: Reflector): boolean;
export declare function shouldBypassValidation(user: UserWithAuthRole, context: ExecutionContext, reflector: Reflector): boolean;
