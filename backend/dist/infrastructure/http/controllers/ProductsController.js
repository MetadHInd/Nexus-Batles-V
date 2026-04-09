"use strict";
/**
 * ProductsController.ts + productRoutes.ts (archivo combinado)
 *
 * PROBLEMA DETECTADO EN FASE 1:
 *   paymentsApi.getShopProducts() llama a GET /products?shop=true
 *   pero esta ruta NO EXISTÍA en server.ts → 404 en producción.
 *   ShopPage usaba MOCK_PRODUCTS como fallback silencioso.
 *
 * SOLUCIÓN:
 *   Este archivo crea el Controller + Route del catálogo de productos.
 *   Agregar en server.ts:
 *     import productRoutes from '@infrastructure/http/routes/productRoutes';
 *     app.use('/api/v1/products', productRoutes);
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = void 0;
const connection_1 = require("../../database/connection");
class ProductsController {
    // GET /api/v1/products?shop=true → todos los productos activos con stock
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
    // GET /api/v1/products/:id
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