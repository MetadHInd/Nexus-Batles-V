import { ICacheable } from 'src/shared/cache/interfaces/cacheable.interface';
export declare class ActionModel implements ICacheable {
    id: number;
    description: string | null;
    slug: string | null;
    constructor(id: number, description: string | null, slug: string | null);
    cacheKey(): string;
    cacheTTL(): number;
    static fromDatabase(data: any): ActionModel;
    static fromJSON(json: Record<string, any>): ActionModel;
    toJSON(): {
        id: number;
        description: string | null;
        slug: string | null;
    };
}
