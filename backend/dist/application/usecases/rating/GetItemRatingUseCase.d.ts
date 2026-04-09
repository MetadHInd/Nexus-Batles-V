import { MySQLRatingRepository } from '../../../infrastructure/repositories/MySQLRatingRepository';
import { MySQLProductRepository } from '../../../infrastructure/repositories/MySQLProductRepository';
export declare class GetProductRatingUseCase {
    private ratingRepository;
    private productRepository;
    constructor(ratingRepository: MySQLRatingRepository, productRepository: MySQLProductRepository);
    execute(productId: number): Promise<{
        average: number;
        count: number;
    }>;
}
//# sourceMappingURL=GetItemRatingUseCase.d.ts.map