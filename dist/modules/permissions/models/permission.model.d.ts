import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';
export declare class PermissionModel implements ICacheable {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
    tenant_ids: string[];
    action_id: number | null;
    module_id: number;
    slug: string | null;
    constructor(id: number, code: string, name: string, description: string | null, is_active: boolean, tenant_ids: string[], action_id: number | null, module_id: number, slug: string | null);
    cacheKey(): string;
    cacheTTL(): number;
    toJSON(): Record<string, any>;
    static fromJSON(json: {
        id: number;
        code: string;
        name: string;
        description: string | null;
        is_active: boolean;
        tenant_ids: string[];
        action_id: number | null;
        module_id: number;
        slug: string | null;
    }): PermissionModel;
}
