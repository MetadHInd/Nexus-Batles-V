"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = void 0;
const connection_1 = require("../database/connection");
class ProductsController {
    async getProducts(req, res, next) {
        try {
            const shopOnly = req.query.shop === 'true';
            const query = shopOnly
                ? `SELECT id as product_id, name, description, ROUND(price * 100) as price_cents,
                  'USD' as currency, stock as available_stock, 1 as is_active,
                  JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.rarity')) as rarity,
                  JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.type'))   as type,
                  JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.emoji'))  as emoji
           FROM products
           WHERE stock > 0
           ORDER BY FIELD(JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.rarity')),
                          'LEGENDARY','EPIC','RARE','COMMON')`
                : `SELECT id as product_id, name, description, ROUND(price * 100) as price_cents,
                  'USD' as currency, stock as available_stock, 1 as is_active
           FROM products
           ORDER BY id DESC`;
            const [rows] = await connection_1.pool.execute(query);
            res.json({ success: true, data: rows });
        }
        catch (err) {
            next(err);
        }
    }
    async getById(req, res, next) {
        try {
            const [rows] = await connection_1.pool.execute(`SELECT id as product_id, name, description, ROUND(price * 100) as price_cents,
                'USD' as currency, stock as available_stock
         FROM products WHERE id = ? LIMIT 1`, [req.params.id]);
            if (!rows.length) {
                res.status(404).json({ success: false, error: 'PRODUCT_NOT_FOUND' });
                return;
            }
            res.json({ success: true, data: rows[0] });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.productsController = new ProductsController();
//# sourceMappingURL=ProductsController.js.map