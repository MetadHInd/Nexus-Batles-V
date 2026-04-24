// server.ts - Versión corregida con tipos para QueryResult
import express   from 'express';
import helmet    from 'helmet';
import cors      from 'cors';
import rateLimit from 'express-rate-limit';
import { env }   from './config/env';
import { logger } from './infrastructure/logging/logger';
import { errorHandler }   from './infrastructure/http/middlewares/errorHandler';
import { testConnection } from './infrastructure/database/connection';

// Importar tipos de mysql2
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// ── Rutas v1 ────────────────────────────────────────────────
import authRoutes    from './infrastructure/http/routes/authRoutes';

// ── Rutas con factory (Inventario) ─────────────────────────
import { createInventoryRoutes } from './infrastructure/http/routes/inventory.routes';

// ── Rutas con factory (Rating) ───────────────────────────────
import { createRatingRoutes } from './infrastructure/http/routes/rating.routes';

// ── Repositorios ────────────────────────────────────────────
import { MySQLItemRepository }    from './infrastructure/repositories/MySQLItemRepository';
import { MySQLRatingRepository }  from './infrastructure/repositories/MySQLRatingRepository';
import { MySQLProductRepository } from './infrastructure/repositories/MySQLProductRepository';

// ── Use Cases (Inventario) ─────────────────────────────────
import { SearchItems }       from './application/usecases/inventory/SearchItem';
import { GetItems }          from './application/usecases/inventory/GetItem';
import { GetItemById }       from './application/usecases/inventory/GetItemById';
import { DeleteItem }        from './application/usecases/inventory/DeleteItem';
import { CreateItem }        from './application/usecases/inventory/CreateItem';
import { UpdateItem }        from './application/usecases/inventory/UpdateItem';
import { SoftDeleteItem }    from './application/usecases/inventory/SoftDeleteItem';
import { ReactivateItem }    from './application/usecases/inventory/ReactivateItem';
import { GetUserInventory }  from './application/usecases/inventory/GetUserInventory';

import { createProductRoutes } from './infrastructure/http/routes/product.routes';

// ── Controladores con DI (Inventario) ──────────────────────
import { InventoryController } from './infrastructure/http/controllers/InventoryController';
import { RatingController } from './infrastructure/http/controllers/RatingController';

// ── Servicios ──────────────────────────────────────────────
import { RatingService } from './domain/services/RatingService';

// ═══════════════════════════════════════════════════════════
// TUS HÉROES
// ═══════════════════════════════════════════════════════════
import { MySQLHeroRepository } from './infrastructure/repositories/MySQLHeroRepository';
import { HeroController } from './infrastructure/http/controllers/HeroController';
import { CrearHeroe } from './application/usecases/Heroes/CrearHeroe';
import { ObtenerHeroes } from './application/usecases/Heroes/ObtenerHeroes';
import { ObtenerHeroePorId } from './application/usecases/Heroes/ObtenerHeroePorId';
import { ActualizarHeroe } from './application/usecases/Heroes/ActualizarHeroe';
import { EliminarHeroe } from './application/usecases/Heroes/EliminarHeroe';
import { createHeroRoutes } from './infrastructure/http/routes/hero.routes';

// Importar pool con tipos
import { pool } from './infrastructure/database/connection';

// ============================================================
// INYECCIÓN DE DEPENDENCIAS
// ============================================================

// ── Inventario ──────────────────────────────────────────────
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

// ✅ HÉROES - INYECCIÓN
const heroRepository = new MySQLHeroRepository();
const heroController = new HeroController(
  new CrearHeroe(heroRepository),
  new ObtenerHeroes(heroRepository),
  new ObtenerHeroePorId(heroRepository),
  new ActualizarHeroe(heroRepository),
  new EliminarHeroe(heroRepository)
);

// ============================================================
// EXPRESS APP
// ============================================================
const app = express();

// ── [1] Seguridad ────────────────────────────────────────────
app.use(helmet());

// ── [2] CORS — debe ir antes de cualquier ruta ───────────────
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// ── [3] Body parsing — CRÍTICO: debe preceder a todas las rutas ──
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============================================================
// RUTAS DIRECTAS PRODUCTOS (CORREGIDAS)
// ============================================================

// ✅ Obtener un producto por ID (para la página de detalle)
app.get('/api/v1/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando producto con ID:', id);
    
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      console.log('❌ Producto no encontrado:', id);
      return res.status(404).json({ 
        success: false, 
        error: 'Producto no encontrado' 
      });
    }
    
    console.log('✅ Producto encontrado:', rows[0]);
    res.json({ 
      success: true, 
      product: rows[0] 
    });
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener producto' 
    });
  }
});

// ============================================================
// RUTAS DIRECTAS HÉROES (CORREGIDAS)
// ============================================================

// ✅ Obtener todos los héroes
app.get('/api/v1/heroes', async (req, res) => {
  try {
    console.log('🔍 GET /api/v1/heroes');
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, description, price, stars, type, image, stock, 
              poder, vida, defensa, ataque, damage, efecto, descuento 
       FROM heroes ORDER BY id DESC`
    );
    console.log(`✅ Enviando ${rows.length} héroes`);
    res.json({ success: true, heroes: rows });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: 'Error al obtener héroes' });
  }
});

// ✅ Obtener un héroe por ID
app.get('/api/v1/heroes/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT id, name, description, price, stars, type, image, stock,
              poder, vida, defensa, ataque, damage, efecto, descuento 
       FROM heroes WHERE id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Héroe no encontrado' });
    }
    
    res.json({ success: true, hero: rows[0] });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: 'Error al obtener héroe' });
  }
});

// ✅ Crear un héroe (CORREGIDO)
app.post('/api/v1/heroes', async (req, res) => {
  try {
    const { name, description, price, stars, type, image, stock, poder, vida, defensa, ataque, damage, efecto, descuento } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO heroes (name, description, price, stars, type, image, stock, 
        poder, vida, defensa, ataque, damage, efecto, descuento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, stars || 3, type, image || '', stock || 0, 
       poder || 0, vida || 0, defensa || 0, ataque || '', damage || '', 
       efecto || '', descuento || 0]
    );
    
    res.json({ success: true, hero: { id: result.insertId, ...req.body } });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: 'Error al crear héroe' });
  }
});

// ✅ Actualizar un héroe (CORREGIDO)
app.put('/api/v1/heroes/:id', async (req, res) => {
  try {
    const { name, description, price, stars, type, image, stock, poder, vida, 
            defensa, ataque, damage, efecto, descuento } = req.body;
    const id = req.params.id;
    
    await pool.query<ResultSetHeader>(
      `UPDATE heroes SET name=?, description=?, price=?, stars=?, type=?, 
        image=?, stock=?, poder=?, vida=?, defensa=?, ataque=?, damage=?, 
        efecto=?, descuento=? 
       WHERE id=?`,
      [name, description, price, stars, type, image, stock, poder, vida, 
       defensa, ataque, damage, efecto, descuento, id]
    );
    
    res.json({ success: true, message: 'Héroe actualizado' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar héroe' });
  }
});

// ✅ Eliminar un héroe (CORREGIDO)
app.delete('/api/v1/heroes/:id', async (req, res) => {
  try {
    await pool.query<ResultSetHeader>('DELETE FROM heroes WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Héroe eliminado' });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: 'Error al eliminar héroe' });
  }
});

// ── Rate limiting ──────────────────────────────────────────
const globalLimiter    = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true });
const sensitiveLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20,  standardHeaders: true });
const inventoryLimiter = rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false, skipFailedRequests: true });

app.use('/api',             globalLimiter);
app.use('/api/v1/auth',     sensitiveLimiter);

// ── Health check ───────────────────────────────────────────
app.get('/health', (_req, res) => res.json({
  status: 'ok', 
  env: env.NODE_ENV, 
  version: '5.0.0',
  timestamp: new Date().toISOString(),
}));

// ============================================================
// RUTAS PRINCIPALES
// ============================================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/inventory', inventoryLimiter, createInventoryRoutes(inventoryController));
app.use('/api/v1/products', createRatingRoutes(ratingController));

// ✅ RUTAS DE HÉROES (usando el controlador con DI)
app.use('/api/v1/heroes-di', createHeroRoutes(heroController));

// ✅ RUTAS DE PRODUCTOS (armas, armaduras, etc.)
app.use('/api/v1', createProductRoutes());

app.use(errorHandler);

// ============================================================
// ARRANQUE
// ============================================================
async function bootstrap() {
  try {
    await testConnection();
    logger.info('Conexión a MySQL/TiDB establecida');
    
    app.listen(env.PORT, () => {
      logger.info(`Servidor corriendo en puerto ${env.PORT} [${env.NODE_ENV}]`);
      console.log('\n  ════════════════════════════════════════════════════');
      console.log('  ✦ THE NEXUS BATTLES V — API Unificada ✦');
      console.log('  ════════════════════════════════════════════════════');
      console.log(`  📡 Servidor:    http://localhost:${env.PORT}`);
      console.log(`  ❤️  Health:      GET http://localhost:${env.PORT}/health`);
      console.log(`  ⚔️  Héroes:      GET http://localhost:${env.PORT}/api/v1/heroes`);
      console.log(`  ⚔️  Héroes DI:   GET http://localhost:${env.PORT}/api/v1/heroes-di`);
      console.log(`  🗡️  Productos:   GET http://localhost:${env.PORT}/api/v1/products`);
      console.log('  ════════════════════════════════════════════════════');
    });
  } catch (err: any) {
    console.error('\n❌ ERROR CRÍTICO AL CONECTAR A LA BASE DE DATOS:');
    console.error(`Mensaje: ${err.message}`);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('\n❌ ERROR CRÍTICO AL INICIAR EL SERVIDOR:');
  console.error(err);
  process.exit(1);
});

export default app;