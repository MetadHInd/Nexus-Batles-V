import { IItemRepository } from '../../../domain/repositories/IItemRepository';
export declare class SearchItems {
    private readonly itemRepository;
    constructor(itemRepository: IItemRepository);
    execute(query: string): Promise<{
        results: any[];
        total: number;
        query: string;
    }>;
}
//# sourceMappingURL=SearchItem.d.ts.map