import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class CanCreateUsersGuard implements CanActivate {
    private readonly logger;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
