import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';
export declare class RolePermissionModel implements ICacheable {
    id: number;
    role_id: number;
    permission_id: number;
    tenant_ids: string[];
    is_active: boolean;
    constructor(id: number, role_id: number, permission_id: number, tenant_ids: string[], is_active: boolean);
    cacheKey(): string;
    cacheTTL(): number;
    toJSON(): Record<string, any>;
    static fromJSON(json: {
        id: number;
        role_id: number;
        permission_id: number;
        tenant_ids: string[];
        is_active: boolean;
    }): RolePermissionModel;
}
export declare class RolePermissionDetailModel extends RolePermissionModel {
    permission?: {
        id: number;
        code: string;
        name: string;
        description: string | null;
        is_active: boolean | null;
    };
    role?: {
        idrole: number;
        description: string | null;
    };
    toJSON(): Record<string, any>;
    static fromJSON(json: any): RolePermissionDetailModel;
}
