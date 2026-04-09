/**
 * inventory.routes.ts — Infrastructure / HTTP / Routes
 * FIX: eliminado router.use(inventoryLimiter) — server.ts ya lo aplica al montar esta ruta
 */
import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
export declare const createInventoryRoutes: (controller: InventoryController) => Router;
//# sourceMappingURL=inventory.routes.d.ts.map