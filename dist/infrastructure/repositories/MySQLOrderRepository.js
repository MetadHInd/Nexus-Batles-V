"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLOrderRepository = void 0;
const Order_1 = require("../../domain/entities/Order");
const connection_1 = require("../database/connection");
class MySQLOrderRepository {
    async createOrderWithItems(userId, items) {
        const connection = await connection_1.pool.getConnection();
        try {
            await connection.beginTransaction();
            let total = 0;
            for (const item of items) {
                total += item.price * item.quantity;
            }
            const [orderResult] = await connection.query("INSERT INTO orders (user_id, total) VALUES (?, ?)", [userId, total]);
            const orderId = orderResult.insertId;
            for (const item of items) {
                await connection.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", [orderId, item.productId, item.quantity, item.price]);
                await connection.query("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.productId]);
            }
            await connection.query("DELETE FROM cart WHERE user_id = ?", [userId]);
            await connection.commit();
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async findByUser(userId) {
        const [rows] = await connection_1.pool.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
        return rows.map((row) => new Order_1.Order(row.id, row.user_id, row.total, row.created_at));
    }
}
exports.MySQLOrderRepository = MySQLOrderRepository;
//# sourceMappingURL=MySQLOrderRepository.js.map