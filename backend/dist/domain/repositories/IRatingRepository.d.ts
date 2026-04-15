import { Rating } from '../entities/Rating';
export interface IRatingRepository {
    findByUserAndItem(userId: string, itemId: string): Promise<Rating | null>;
    create(rating: Rating): Promise<void>;
    update(id: string, score: number): Promise<void>;
    getAverageByItem(itemId: string): Promise<{
        average: number;
        count: number;
    }>;
    getAverageByProduct(productId: string): Promise<{
        average: number;
        count: number;
    }>;
    exists(userId: string, itemId: string): Promise<boolean>;
}
//# sourceMappingURL=IRatingRepository.d.ts.map