import { Item } from "../../domain/entities/Item";
import { IItemRepository, ItemFilters } from "../../domain/repositories/IItemRepository";
interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
}
export declare class MySQLItemRepository implements IItemRepository {
    findById(id: string): Promise<Item | null>;
    findAll(filters: ItemFilters): Promise<PaginatedResult<Item>>;
    search(query: string): Promise<Item[]>;
    save(item: Item): Promise<Item>;
    update(item: Item): Promise<Item>;
    delete(id: string): Promise<boolean>;
    private mapToEntity;
    private parseJSON;
}
export {};
//# sourceMappingURL=MySQLItemRepository.d.ts.map