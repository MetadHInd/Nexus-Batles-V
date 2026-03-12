export declare class HierarchyValidator {
    private static readonly logger;
    static validateRoleHierarchy(currentUserRoleId: number, targetRoleId: number, operationDescription?: string): Promise<void>;
    static validateUserHierarchy(currentUserRoleId: number, targetUserId: number, operationDescription?: string): Promise<void>;
    static validateRoleCreationOrAssignment(currentUserRoleId: number, roleToAssign: number, operationDescription?: string): Promise<void>;
    private static getRoleHierarchy;
    private static getRoleDescription;
}
