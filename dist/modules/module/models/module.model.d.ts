import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';
export declare class ModuleModel implements ICacheable {
    id: number;
    name: string;
    module: string;
    description: string | null;
    uuid: string;
    slug: string | null;
    constructor(id: number, name: string, module: string, description: string | null, uuid: string, slug: string | null);
    cacheKey(): string;
    cacheTTL(): number;
    static fromDatabase(data: any): ModuleModel;
    static fromJSON(json: Record<string, any>): ModuleModel;
    toJSON(): {
        id: number;
        name: string;
        module: string;
        description: string | null;
        uuid: string;
        slug: string | null;
    };
}
