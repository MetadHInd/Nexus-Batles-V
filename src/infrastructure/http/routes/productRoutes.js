"use strict";
/**
 * productRoutes.ts — Infrastructure / HTTP / Routes
 * NUEVO ARCHIVO — faltaba en server.ts (gap detectado en Fase 1).
 *
 * Registrar en server.ts:
 *   import productRoutes from '@infrastructure/http/routes/productRoutes';
 *   app.use('/api/v1/products', productRoutes);
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ProductsController_1 = require("../../controllers/ProductsController");
var router = (0, express_1.Router)();
// Público — el catálogo de la tienda no requiere autenticación
router.get('/', ProductsController_1.productsController.getProducts.bind(ProductsController_1.productsController));
router.get('/:id', ProductsController_1.productsController.getById.bind(ProductsController_1.productsController));
exports.default = router;
