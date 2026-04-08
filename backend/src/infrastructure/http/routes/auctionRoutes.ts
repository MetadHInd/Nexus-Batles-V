/**
 * auctionRoutes.ts — Infrastructure / HTTP / Routes
 * HU: Rutas de API Gateway para subastas
 *
 * Rutas registradas en el API Gateway bajo /api/v1/auctions:
 *
 *   GET    /api/v1/auctions              — Listar subastas activas (publico)
 *   GET    /api/v1/auctions/:id          — Detalle de subasta (publico)
 *   POST   /api/v1/auctions              — Publicar subasta (ADMIN, JWT requerido)
 *   DELETE /api/v1/auctions/:id          — Cancelar subasta (ADMIN, JWT requerido)
 *   POST   /api/v1/auctions/:id/pujas    — Realizar puja (autenticado, JWT requerido)
 *   GET    /api/v1/auctions/:id/pujas    — Historial de pujas (publico)
 *
 * Criterios de aceptacion cubiertos:
 *   CA-1 Todas las rutas del modulo registradas en el API Gateway.
 *   CA-2 Rutas protegidas requieren token JWT valido en Authorization header.
 *   CA-3 El API Gateway valida el formato del token antes de redirigir.
 *   CA-4 Codigos HTTP estandar: 200, 201, 400, 401, 403, 404, 500.
 *   CA-5 Documentacion OpenAPI en docs/swagger/auctions.openapi.yaml
 */

import { Router } from 'express';
import { z }      from 'zod';
import { validate }                    from '../middlewares/validateMiddleware';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';
import { AuctionController }           from '../controllers/AuctionController';
import { MySQLAuctionRepository }      from '../../repositories/MySQLAuctionRepository';
import { MySQLPlayerRepository }       from '../../repositories/MySQLPlayerRepository';

// ── Inyeccion de dependencias ─────────────────────────────────────────────────
const auctionRepository = new MySQLAuctionRepository();
const playerRepository  = new MySQLPlayerRepository();
const controller        = new AuctionController(auctionRepository, playerRepository);

// ── Schemas de validacion Zod ─────────────────────────────────────────────────

/** CA-4: valida el body de POST /auctions — retorna 400 si falla */
const createAuctionSchema = z.object({
  itemId:     z.string().uuid({ message: 'itemId debe ser un UUID valido' }),
  startPrice: z.number().positive({ message: 'startPrice debe ser mayor a 0' }),
  endsAt:     z.string().datetime({ message: 'endsAt debe ser una fecha ISO 8601 valida' }),
});

/** CA-4: valida el body de POST /auctions/:id/pujas — retorna 400 si falla */
const placeBidSchema = z.object({
  amount: z.number().positive({ message: 'El monto de la puja debe ser mayor a 0' }),
});

/** Parametro de ruta :id — UUID */
const idParamSchema = z.object({
  id: z.string().uuid({ message: 'El id de subasta debe ser un UUID valido' }),
});

/** Query params de paginacion */
const paginationSchema = z.object({
  limit:  z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

// ── Router ────────────────────────────────────────────────────────────────────
const router = Router();

/**
 * GET /api/v1/auctions
 * Lista subastas activas. Publico — no requiere autenticacion.
 * Query: limit (default 20, max 100), offset (default 0)
 * Responde: 200 { auctions[], limit, offset }
 */
router.get(
  '/',
  controller.list.bind(controller),
);

/**
 * GET /api/v1/auctions/:id
 * Detalle de una subasta. Publico — no requiere autenticacion.
 * Responde: 200 Auction | 404 Not Found
 */
router.get(
  '/:id',
  controller.getById.bind(controller),
);

/**
 * POST /api/v1/auctions
 * Publica una nueva subasta.
 * CA-2/CA-3: requiere JWT valido + rol ADMIN en Authorization header.
 * Responde: 201 Auction | 400 Validation | 401 Unauthorized | 403 Forbidden
 */
router.post(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  validate(createAuctionSchema),
  controller.create.bind(controller),
);

/**
 * DELETE /api/v1/auctions/:id
 * Cancela una subasta existente.
 * CA-2/CA-3: requiere JWT valido + rol ADMIN en Authorization header.
 * Responde: 200 OK | 401 Unauthorized | 403 Forbidden | 404 Not Found
 */
router.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  controller.cancel.bind(controller),
);

/**
 * POST /api/v1/auctions/:id/pujas
 * Realiza una puja en una subasta activa.
 * CA-2/CA-3: requiere JWT valido en Authorization header (cualquier rol).
 * Responde: 201 Auction | 400 Validation | 401 Unauthorized | 404 Not Found
 */
router.post(
  '/:id/pujas',
  authMiddleware,
  validate(placeBidSchema),
  controller.placeBid.bind(controller),
);

/**
 * GET /api/v1/auctions/:id/pujas
 * Historial de pujas de una subasta. Publico — no requiere autenticacion.
 * Responde: 200 { auctionId, currentPrice, bids[] } | 404 Not Found
 */
router.get(
  '/:id/pujas',
  controller.getBidHistory.bind(controller),
);

export default router;
