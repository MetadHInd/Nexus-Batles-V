import { IItemRepository, ItemFilters, PaginatedResult } from "../../../domain/repositories/IItemRepository";
import { Item } from "../../../domain/entities/Item";
export declare class GetItems {
    private itemRepository;
    constructor(itemRepository: IItemRepository);
    execute(filters: ItemFilters): Promise<PaginatedResult<Item>>;
}
//# sourceMappingURL=GetItem.d.ts.map