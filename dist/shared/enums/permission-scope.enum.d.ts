export declare enum PermissionScope {
    OWN = "own",
    TEAM = "team",
    BRANCH = "branch",
    ORGANIZATION = "organization",
    GLOBAL = "global",
    CUSTOM = "custom"
}
export declare const PERMISSION_SCOPES: PermissionScope[];
export declare const PERMISSION_SCOPE_DESCRIPTIONS: Record<PermissionScope, string>;
