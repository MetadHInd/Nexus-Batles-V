import { IItemRepository } from '../../../domain/repositories/IItemRepository';
export declare class GetItemById {
    private readonly itemRepository;
    constructor(itemRepository: IItemRepository);
    execute(id: string): Promise<{
        item: any;
    }>;
}
//# sourceMappingURL=GetItemById.d.ts.map