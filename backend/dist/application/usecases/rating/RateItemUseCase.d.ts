import { MySQLRatingRepository } from '../../../infrastructure/repositories/MySQLRatingRepository';
import { MySQLProductRepository } from '../../../infrastructure/repositories/MySQLProductRepository';
interface RateProductRequest {
    userId: string;
    productId: number;
    score: number;
}
export declare class RateProductUseCase {
    private ratingRepository;
    private productRepository;
    constructor(ratingRepository: MySQLRatingRepository, productRepository: MySQLProductRepository);
    execute(request: RateProductRequest): Promise<{
        message: string;
        rating: {
            id: string;
            productId: number;
            itemId: string;
            score: number;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
export {};
//# sourceMappingURL=RateItemUseCase.d.ts.map