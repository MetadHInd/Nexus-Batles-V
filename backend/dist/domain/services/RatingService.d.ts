import { IRatingRepository } from '../repositories/IRatingRepository';
import { IProductRepository } from '../repositories/IProductRepository';
export declare class RatingService {
    private ratingRepo;
    private productRepo;
    constructor(ratingRepo: IRatingRepository, productRepo: IProductRepository);
    rateProduct(userId: string, productId: number, score: number): Promise<{
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
    getUserRating(userId: string, productId: number): Promise<{
        productId: number;
        id: string;
        itemId: string;
        userId: string;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getProductRating(productId: number): Promise<{
        average: number;
        count: number;
    }>;
    hasUserRated(userId: string, productId: number): Promise<boolean>;
}
//# sourceMappingURL=RatingService.d.ts.map