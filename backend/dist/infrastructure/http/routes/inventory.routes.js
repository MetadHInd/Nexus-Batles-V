"use strict";
/**
 * inventory.routes.ts — Infrastructure / HTTP / Routes
 * FIX: eliminado router.use(inventoryLimiter) — server.ts ya lo aplica al montar esta ruta
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInventoryRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const inventory_schemas_1 = require("../schemas/inventory.schemas");
const createInventoryRoutes = (controller) => {
    const router = (0, express_1.Router)();
    router.get('/search', (0, validation_middleware_1.validateQuery)(inventory_schemas_1.SearchQuerySchema), controller.search);
    router.get('/', (0, validation_middleware_1.validateQuery)(inventory_schemas_1.GetItemsQuerySchema), controller.list);
    router.get('/:id', controller.getById);
    router.delete('/:id', auth_middleware_1.authenticateJWT, controller.delete);
    return router;
};
exports.createInventoryRoutes = createInventoryRoutes;
//# sourceMappingURL=inventory.routes.js.map