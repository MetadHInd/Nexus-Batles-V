export declare class UserRoleService {
    private readonly logger;
    canModifyAIAUsers(authorizationRole: number): boolean;
    hasGlobalAccess(authorizationRole: number): boolean;
    getUserRoleInfo(userId: number): Promise<{
        authorizationRole?: number;
        localRole?: number;
        isAIA: boolean;
        canModifyAIA: boolean;
        hasGlobalAccess: boolean;
    }>;
    canUserModifyUser(currentUserId: number, targetUserId: number, currentAuthRole: number): Promise<boolean>;
    logSecurityAction(action: string, currentUserId: number, targetUserId?: number, authRole?: number, localRole?: number, allowed?: boolean): void;
}
