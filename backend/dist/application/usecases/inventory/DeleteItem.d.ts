import { IItemRepository } from '../../../domain/repositories/IItemRepository';
export declare class DeleteItem {
    private readonly itemRepository;
    constructor(itemRepository: IItemRepository);
    execute(itemId: string, userId: string): Promise<{
        item: any;
        deletedAt: Date;
    }>;
}
//# sourceMappingURL=DeleteItem.d.ts.map