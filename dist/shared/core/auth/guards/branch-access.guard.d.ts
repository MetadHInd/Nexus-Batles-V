import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export interface BranchAccessConfig {
    requireManager?: boolean;
    paramName?: string;
    bodyField?: string;
}
export declare class BranchAccessGuard implements CanActivate {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
}
