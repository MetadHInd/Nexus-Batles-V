export declare const BRANCH_ACCESS_KEY = "branchAccess";
export interface BranchAccessConfig {
    requireManager?: boolean;
    paramName?: string;
    bodyField?: string;
}
export declare const RequireBranchAccess: (config?: BranchAccessConfig) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireBranchManager: (paramName?: string) => import("@nestjs/common").CustomDecorator<string>;
