"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
// domain/entities/Rating.ts
class Rating {
    constructor(id, itemId, // ⚠️ Cambiado de productId a itemId
    userId, score, // En el código se llama score
    createdAt, updatedAt) {
        this.id = id;
        this.itemId = itemId;
        this.userId = userId;
        this.score = score;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(itemId, userId, score) {
        const now = new Date();
        return new Rating(crypto.randomUUID(), itemId, userId, score, now, now);
    }
    updateScore(newScore) {
        return new Rating(this.id, this.itemId, this.userId, newScore, this.createdAt, new Date());
    }
}
exports.Rating = Rating;
//# sourceMappingURL=Rating.js.map