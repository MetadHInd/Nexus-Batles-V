"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLCartRepository = void 0;
const connection_1 = require("../database/connection");
class MySQLCartRepository {
    async addProduct(userId, productId, quantity) {
        const [rows] = await connection_1.pool.query("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [userId, productId]);
        if (rows.length > 0) {
            await connection_1.pool.query("UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?", [quantity, userId, productId]);
        }
        else {
            await connection_1.pool.query("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)", [userId, productId, quantity]);
        }
    }
    async getCart(userId) {
        const [rows] = await connection_1.pool.query("SELECT * FROM cart WHERE user_id = ?", [userId]);
        return rows;
    }
    async updateQuantity(id, quantity) {
        await connection_1.pool.query("UPDATE cart SET quantity = ? WHERE id = ?", [quantity, id]);
    }
    async removeProduct(id) {
        await connection_1.pool.query("DELETE FROM cart WHERE id = ?", [id]);
    }
}
exports.MySQLCartRepository = MySQLCartRepository;
//# sourceMappingURL=MySQLCartRepository.js.map