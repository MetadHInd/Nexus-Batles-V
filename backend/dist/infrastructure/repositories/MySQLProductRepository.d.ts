import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/IProductRepository";
export declare class MySQLProductRepository implements ProductRepository {
    findById(id: number): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    updateStock(id: number, newStock: number): Promise<void>;
}
//# sourceMappingURL=MySQLProductRepository.d.ts.map