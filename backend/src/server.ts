/**
 * server.ts — Entry point — THE NEXUS BATTLES V
 */

import express   from 'express';
import helmet    from 'helmet';
import cors      from 'cors';
import rateLimit from 'express-rate-limit';
import { env }   from './config/env';
import { logger } from './infrastructure/logging/logger';
import { errorHandler }   from './infrastructure/http/middlewares/errorHandler';
// Importamos ÚNICAMENTE la función de prueba, el pool se queda en su archivo
import { testConnection } from './infrastructure/database/connection';

// ── Rutas v1 ────────────────────────────────────────────────
import authRoutes    from './infrastructure/http/routes/authRoutes';

// ── Rutas con factory (Inventario) ─────────────────────────
import { createInventoryRoutes } from './infrastructure/http/routes/inventory.routes';

// ── Rutas con factory (Rating) ───────────────────────────────
import { createRatingRoutes } from './infrastructure/http/routes/rating.routes';

// ── Repositorios ──────────────────────────────────────────────────────────────
import { MySQLItemRepository }    from './infrastructure/repositories/MySQLItemRepository';
import { MySQLRatingRepository }  from './infrastructure/repositories/MySQLRatingRepository';
import { MySQLProductRepository } from './infrastructure/repositories/MySQLProductRepository';

// ── Use Cases ─────────────────────────────────────────────────────────────────
import { SearchItems }       from './application/usecases/inventory/SearchItem';
import { GetItems }          from './application/usecases/inventory/GetItem';
import { GetItemById }       from './application/usecases/inventory/GetItemById';
import { DeleteItem }        from './application/usecases/inventory/DeleteItem';
import { CreateItem }        from './application/usecases/inventory/CreateItem';
import { UpdateItem }        from './application/usecases/inventory/UpdateItem';
import { SoftDeleteItem }    from './application/usecases/inventory/SoftDeleteItem';
import { ReactivateItem }    from './application/usecases/inventory/ReactivateItem';
import { GetUserInventory }  from './application/usecases/inventory/GetUserInventory';

// ── Controladores con DI ──────────────────────────────────────────────────────
import { InventoryController } from './infrastructure/http/controllers/InventoryController';
import { RatingController } from './infrastructure/http/controllers/RatingController';

// ── Servicios ──────────────────────────────────────────────────────────────────
import { RatingService } from './domain/services/RatingService';

// ============================================================
// INYECCIÓN DE DEPENDENCIAS
// ============================================================

// Inventario
const itemRepository      = new MySQLItemRepository();
const inventoryController = new InventoryController(
  new SearchItems(itemRepository),
  new GetItems(itemRepository),
  new GetItemById(itemRepository),
  new DeleteItem(itemRepository),
  new CreateItem(itemRepository),
  new UpdateItem(itemRepository),
  new SoftDeleteItem(itemRepository),
  new ReactivateItem(itemRepository),
  new GetUserInventory(itemRepository),
);

// Rating
const ratingRepository   = new MySQLRatingRepository();
const productRepository  = new MySQLProductRepository();
const ratingService      = new RatingService(ratingRepository, productRepository);
const ratingController   = new RatingController(ratingService);

// Auth helpers
// ============================================================
// EXPRESS APP
// ============================================================
const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

app.use(express.json({
  verify: (req: any, _res, buf) => { req.rawBody = buf.toString(); },
}));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ──────────────────────────────────────────────────────────────
const globalLimiter    = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true });
const sensitiveLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  standardHeaders: true });
const inventoryLimiter = rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false, skipFailedRequests: true });

app.use('/api',             globalLimiter);
app.use('/api/v1/auth',     sensitiveLimiter);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({
  status: 'ok', env: env.NODE_ENV, version: '5.0.0',
  timestamp: new Date().toISOString(),
}));

// ============================================================
// RUTAS
// ============================================================
app.use('/api/v1/auth',     authRoutes);
app.use('/api/v1/inventory', inventoryLimiter, createInventoryRoutes(inventoryController));
app.use('/api/v1/products', createRatingRoutes(ratingController));

app.use(errorHandler);

// ============================================================
// ARRANQUE
// ============================================================
async function bootstrap() {
  try {
    // Esta función se importa de ./infrastructure/database/connection
    await testConnection();
    logger.info('Conexión a MySQL/TiDB establecida');
    
    app.listen(env.PORT, () => {
      logger.info(`Servidor corriendo en puerto ${env.PORT} [${env.NODE_ENV}]`);
      console.log('\n  THE NEXUS BATTLES V — API Unificada');
      console.log('═'.repeat(70));
      console.log(` Servidor: http://localhost:${env.PORT}`);
      console.log(` Health:   GET http://localhost:${env.PORT}/health`);
      console.log('═'.repeat(70));
    });
  } catch (err: any) {
    console.error('\n ERROR CRÍTICO AL CONECTAR A LA BASE DE DATOS:');
    console.error(`Mensaje: ${err.message}`);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('\nERROR CRÍTICO AL INICIAR EL SERVIDOR:');
  console.error(err);
  process.exit(1);
});

export default app;