import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';
export declare class RoleModel implements ICacheable {
    idrole: number;
    description: string | null;
    tenant_ids: string[];
    is_super: boolean | null;
    hierarchy_level: number;
    constructor(idrole: number, description: string | null, tenant_ids: string[], is_super: boolean | null, hierarchy_level?: number);
    cacheKey(): string;
    cacheTTL(): number;
    toJSON(): Record<string, any>;
    static fromJSON(json: {
        idrole: number;
        description: string | null;
        tenant_ids: string[];
        is_super: boolean | null;
        hierarchy_level?: number;
    }): RoleModel;
    static fromPrisma(data: any): RoleModel;
}
