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
import { Request, Response, NextFunction } from 'express';
declare class ProductsController {
    getProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const productsController: ProductsController;
export {};
//# sourceMappingURL=ProductsController.d.ts.map