import { Rating } from '../../domain/entities/Rating';
import { IRatingRepository } from '../../domain/repositories/IRatingRepository';
export declare class MySQLRatingRepository implements IRatingRepository {
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
//# sourceMappingURL=MySQLRatingRepository.d.ts.map