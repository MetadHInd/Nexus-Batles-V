import { Product } from '../entities/Product';
export interface IProductRepository {
    findById(id: number): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    updateStock(id: number, newStock: number): Promise<void>;
}
export type ProductRepository = IProductRepository;
//# sourceMappingURL=IProductRepository.d.ts.map