"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const Rating_1 = require("../entities/Rating");
class RatingService {
    constructor(ratingRepo, productRepo) {
        this.ratingRepo = ratingRepo;
        this.productRepo = productRepo;
    }
    async rateProduct(userId, productId, score) {
        if (score < 1 || score > 5)
            throw new Error('La calificación debe ser entre 1 y 5');
        const product = await this.productRepo.findById(productId);
        if (!product)
            throw new Error('Producto no encontrado');
        const itemId = `item-${productId}`;
        const existing = await this.ratingRepo.findByUserAndItem(userId, itemId);
        if (existing) {
            const updated = existing.updateScore(score);
            await this.ratingRepo.update(updated.id, updated.score);
            return {
                message: 'Calificación actualizada',
                rating: {
                    id: updated.id, productId, itemId: updated.itemId,
                    score: updated.score, createdAt: updated.createdAt, updatedAt: updated.updatedAt,
                },
            };
        }
        const newRating = Rating_1.Rating.create(itemId, userId, score);
        await this.ratingRepo.create(newRating);
        return {
            message: 'Calificación guardada',
            rating: {
                id: newRating.id, productId, itemId: newRating.itemId,
                score: newRating.score, createdAt: newRating.createdAt, updatedAt: newRating.updatedAt,
            },
        };
    }
    async getUserRating(userId, productId) {
        const rating = await this.ratingRepo.findByUserAndItem(userId, `item-${productId}`);
        if (!rating)
            return null;
        return { ...rating, productId };
    }
    async getProductRating(productId) {
        return this.ratingRepo.getAverageByItem(`item-${productId}`);
    }
    async hasUserRated(userId, productId) {
        return this.ratingRepo.exists(userId, `item-${productId}`);
    }
}
exports.RatingService = RatingService;
//# sourceMappingURL=RatingService.js.map