"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLProductRepository = void 0;
const connection_1 = require("../database/connection");
const Product_1 = require("../../domain/entities/Product");
class MySQLProductRepository {
    async findById(id) {
        const [rows] = await connection_1.pool.query("SELECT * FROM products WHERE id = ?", [id]);
        if (rows.length === 0)
            return null;
        const row = rows[0];
        return new Product_1.Product(row.id, row.name, row.description, row.price, row.stock);
    }
    async findAll() {
        const [rows] = await connection_1.pool.query("SELECT * FROM products");
        return rows.map((row) => new Product_1.Product(row.id, row.name, row.description, row.price, row.stock));
    }
    async updateStock(id, newStock) {
        await connection_1.pool.query("UPDATE products SET stock = ? WHERE id = ?", [newStock, id]);
    }
}
exports.MySQLProductRepository = MySQLProductRepository;
//# sourceMappingURL=MySQLProductRepository.js.map