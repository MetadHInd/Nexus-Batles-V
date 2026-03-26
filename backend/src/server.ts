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

// ── Rutas v1 (núcleo / Player) ────────────────────────────────────────────────
import authRoutes    from './infrastructure/http/routes/authRoutes';
import auctionRoutes from './infrastructure/http/routes/auctionRoutes';
import missionRoutes from './infrastructure/http/routes/missionRoutes';
import paymentRoutes from './infrastructure/http/routes/paymentRoutes';
import playerRoutes  from './infrastructure/http/routes/playerRoutes';
import cartRoutes    from './infrastructure/http/routes/cartRoutes';
import productRoutes from './infrastructure/http/routes/productRoutes';

// ── Rutas con factory (Inventario + Rating + Auth v2) ─────────────────────────
import { createInventoryRoutes } from './infrastructure/http/routes/inventory.routes';
import { createRatingRoutes }    from './infrastructure/http/routes/rating.routes';
import { createAuthRoutes }      from './infrastructure/http/routes/auth.routes';

// ── Repositorios ──────────────────────────────────────────────────────────────
import { MySQLItemRepository }    from './infrastructure/repositories/MySQLItemRepository';
import { MySQLRatingRepository }  from './infrastructure/repositories/MySQLRatingRepository';
import { MySQLProductRepository } from './infrastructure/repositories/MySQLProductRepository';
import { UserRepositoryMySQL }    from './infrastructure/persistence/repositories/UserRepositoryMysql';

// ── Infraestructura de seguridad ──────────────────────────────────────────────
import { BcryptHasher }    from './infrastructure/security/BcrypHasher';
import { JwtTokenService } from './infrastructure/security/JwtTokenServices';
import { EmailService }    from './infrastructure/gateways/EmailService';

// ── Use Cases ─────────────────────────────────────────────────────────────────
import { SearchItems }  from './application/usecases/inventory/SearchItem';
import { GetItems }     from './application/usecases/inventory/GetItem';
import { GetItemById }  from './application/usecases/inventory/GetItemById';
import { DeleteItem }   from './application/usecases/inventory/DeleteItem';
import { RegisterUser } from './application/usecases/auth/RegisterUser';
import { LoginUser }    from './application/usecases/auth/LoginUser';

// ── Controladores con DI ──────────────────────────────────────────────────────
import { InventoryController } from './infrastructure/http/controllers/InventoryController';
import { RatingController }    from './infrastructure/http/controllers/RatingController';
import { AuthController }      from './infrastructure/http/controllers/AuthController';
import { RatingService }       from './domain/services/RatingService';

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
);

// Rating
const ratingRepository  = new MySQLRatingRepository();
const productRepository = new MySQLProductRepository();
const ratingService     = new RatingService(ratingRepository, productRepository);
const ratingController  = new RatingController(ratingService);

// Auth v2
const userRepository   = new UserRepositoryMySQL();
const passwordHasher   = new BcryptHasher();
const tokenService     = new JwtTokenService();
const emailService     = new EmailService();
const authControllerV2 = new AuthController(
  new RegisterUser(userRepository, passwordHasher, tokenService, emailService),
  new LoginUser(userRepository, passwordHasher, tokenService),
);

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
app.use('/api/v2/auth',     sensitiveLimiter);
app.use('/api/v1/payments', sensitiveLimiter);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({
  status: 'ok', env: env.NODE_ENV, version: '5.0.0',
  timestamp: new Date().toISOString(),
}));

// ============================================================
// RUTAS
// ============================================================
app.use('/api/v1/auth',     authRoutes);
app.use('/api/v1/players',  playerRoutes);
app.use('/api/v1/auctions', auctionRoutes);
app.use('/api/v1/missions', missionRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/cart',     cartRoutes);
app.use('/api/v1/products', productRoutes);

app.use('/api/v1/inventory', inventoryLimiter, createInventoryRoutes(inventoryController));
app.use('/api/v1', createRatingRoutes(ratingController));
app.use('/api/v2/auth', createAuthRoutes(authControllerV2));

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