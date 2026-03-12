"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductsController_1 = require("../../controllers/ProductsController");
const router = (0, express_1.Router)();
router.get('/', ProductsController_1.productsController.getProducts.bind(ProductsController_1.productsController));
router.get('/:id', ProductsController_1.productsController.getById.bind(ProductsController_1.productsController));
exports.default = router;
//# sourceMappingURL=productRoutes.js.map