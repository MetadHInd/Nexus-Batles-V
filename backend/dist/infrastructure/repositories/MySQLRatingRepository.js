"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLRatingRepository = void 0;
// infrastructure/repositories/MySQLRatingRepository.ts
const connection_1 = require("../database/connection");
const Rating_1 = require("../../domain/entities/Rating");
class MySQLRatingRepository {
    async findByUserAndItem(userId, itemId) {
        const [rows] = await connection_1.pool.query(`SELECT 
        id,
        item_id,
        user_id,
        stars,
        created_at,
        updated_at
      FROM ratings 
      WHERE user_id = ? AND item_id = ?`, [userId, itemId]);
        if (rows.length === 0)
            return null;
        const row = rows[0];
        return new Rating_1.Rating(row.id, row.item_id, row.user_id, row.stars, row.created_at, row.updated_at);
    }
    async create(rating) {
        await connection_1.pool.query(`INSERT INTO ratings (
        id, 
        item_id, 
        user_id, 
        stars, 
        created_at, 
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`, [
            rating.id,
            rating.itemId,
            rating.userId,
            rating.score,
            rating.createdAt,
            rating.updatedAt
        ]);
    }
    async update(id, score) {
        await connection_1.pool.query(`UPDATE ratings 
       SET stars = ?, updated_at = ? 
       WHERE id = ?`, [score, new Date(), id]);
    }
    async getAverageByItem(itemId) {
        const [rows] = await connection_1.pool.query(`SELECT 
        AVG(stars) as average,  -- ✅ SQL comment, no JS comment
        COUNT(*) as count 
      FROM ratings 
      WHERE item_id = ?`, [itemId]);
        return {
            average: Number(rows[0]?.average) || 0,
            count: rows[0]?.count || 0
        };
    }
    // Alias de compatibilidad para evitar errores entre ramas Product/Item
    async getAverageByProduct(productId) {
        return this.getAverageByItem(productId);
    }
    async exists(userId, itemId) {
        const [rows] = await connection_1.pool.query('SELECT id FROM ratings WHERE user_id = ? AND item_id = ? LIMIT 1', [userId, itemId]);
        return rows.length > 0;
    }
}
exports.MySQLRatingRepository = MySQLRatingRepository;
//# sourceMappingURL=MySQLRatingRepository.js.map