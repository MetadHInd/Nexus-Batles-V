/**
 * inventory.routes.ts — Infrastructure / HTTP / Routes
 * FIX: eliminado router.use(inventoryLimiter) — server.ts ya lo aplica al montar esta ruta
 */

import { Router }              from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { authenticateJWT }     from '../middlewares/auth.middleware';
import { validateQuery }       from '../middlewares/validation.middleware';
import { SearchQuerySchema, GetItemsQuerySchema } from '../schemas/inventory.schemas';

export const createInventoryRoutes = (controller: InventoryController): Router => {
  const router = Router();

  router.get('/search', validateQuery(SearchQuerySchema), controller.search);
  router.get('/',       validateQuery(GetItemsQuerySchema), controller.list);
  router.get('/:id',    controller.getById);
  router.delete('/:id', authenticateJWT, controller.delete);

  return router;
};
