export declare enum PermissionLevel {
    SYSTEM = "system",
    ADMIN = "admin",
    MANAGER = "manager",
    USER = "user",
    GUEST = "guest"
}
export declare const PERMISSION_LEVELS: PermissionLevel[];
export declare const PERMISSION_LEVEL_DESCRIPTIONS: Record<PermissionLevel, string>;
export declare const PERMISSION_LEVEL_HIERARCHY: Record<PermissionLevel, number>;
