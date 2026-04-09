"use strict";
/**
 * server.ts — Entry point — THE NEXUS BATTLES V
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const logger_1 = require("./infrastructure/logging/logger");
const errorHandler_1 = require("./infrastructure/http/middlewares/errorHandler");
// Importamos ÚNICAMENTE la función de prueba, el pool se queda en su archivo
const connection_1 = require("./infrastructure/database/connection");
//importarmos el heroe
// ── Rutas v1 (núcleo / Player) ────────────────────────────────────────────────
const authRoutes_1 = __importDefault(require("./infrastructure/http/routes/authRoutes"));
const auctionRoutes_1 = __importDefault(require("./infrastructure/http/routes/auctionRoutes"));
const missionRoutes_1 = __importDefault(require("./infrastructure/http/routes/missionRoutes"));
const paymentRoutes_1 = __importDefault(require("./infrastructure/http/routes/paymentRoutes"));
const playerRoutes_1 = __importDefault(require("./infrastructure/http/routes/playerRoutes"));
const cartRoutes_1 = __importDefault(require("./infrastructure/http/routes/cartRoutes"));
const productRoutes_1 = __importDefault(require("./infrastructure/http/routes/productRoutes"));
const hero_routes_1 = require("./infrastructure/http/routes/hero.routes");
// ── Rutas con factory (Inventario + Rating + Auth v2) ─────────────────────────
const inventory_routes_1 = require("./infrastructure/http/routes/inventory.routes");
const rating_routes_1 = require("./infrastructure/http/routes/rating.routes");
const auth_routes_1 = require("./infrastructure/http/routes/auth.routes");
// ── Repositorios ──────────────────────────────────────────────────────────────
const MySQLItemRepository_1 = require("./infrastructure/repositories/MySQLItemRepository");
const MySQLRatingRepository_1 = require("./infrastructure/repositories/MySQLRatingRepository");
const MySQLProductRepository_1 = require("./infrastructure/repositories/MySQLProductRepository");
const UserRepositoryMysql_1 = require("./infrastructure/persistence/repositories/UserRepositoryMysql");
const MySQLHeroRepository_1 = require("./infrastructure/repositories/MySQLHeroRepository");
// ── Infraestructura de seguridad ──────────────────────────────────────────────
const BcrypHasher_1 = require("./infrastructure/security/BcrypHasher");
const JwtTokenServices_1 = require("./infrastructure/security/JwtTokenServices");
const EmailService_1 = require("./infrastructure/gateways/EmailService");
// ── Use Cases ─────────────────────────────────────────────────────────────────
const SearchItem_1 = require("./application/usecases/inventory/SearchItem");
const GetItem_1 = require("./application/usecases/inventory/GetItem");
const GetItemById_1 = require("./application/usecases/inventory/GetItemById");
const DeleteItem_1 = require("./application/usecases/inventory/DeleteItem");
const RegisterUser_1 = require("./application/usecases/auth/RegisterUser");
const LoginUser_1 = require("./application/usecases/auth/LoginUser");
// ── Controladores con DI ──────────────────────────────────────────────────────
const InventoryController_1 = require("./infrastructure/http/controllers/InventoryController");
const RatingController_1 = require("./infrastructure/http/controllers/RatingController");
const AuthController_1 = require("./infrastructure/http/controllers/AuthController");
const RatingService_1 = require("./domain/services/RatingService");
const HeroController_1 = require("./infrastructure/http/controllers/HeroController");
const ObtenerHeroes_1 = require("./application/usecases/Heroes/ObtenerHeroes");
const CrearHeroe_1 = require("./application/usecases/Heroes/CrearHeroe");
// ============================================================
// INYECCIÓN DE DEPENDENCIAS
// ============================================================
// Inventario
const itemRepository = new MySQLItemRepository_1.MySQLItemRepository();
const inventoryController = new InventoryController_1.InventoryController(new SearchItem_1.SearchItems(itemRepository), new GetItem_1.GetItems(itemRepository), new GetItemById_1.GetItemById(itemRepository), new DeleteItem_1.DeleteItem(itemRepository));
//heroes
const heroRepository = new MySQLHeroRepository_1.MySQLHeroRepository();
const heroController = new HeroController_1.HeroController(new CrearHeroe_1.CrearHeroe(heroRepository), new ObtenerHeroes_1.ObtenerHeroes(heroRepository));
// Rating
const ratingRepository = new MySQLRatingRepository_1.MySQLRatingRepository();
const productRepository = new MySQLProductRepository_1.MySQLProductRepository();
const ratingService = new RatingService_1.RatingService(ratingRepository, productRepository);
const ratingController = new RatingController_1.RatingController(ratingService);
// Auth v2
const userRepository = new UserRepositoryMysql_1.UserRepositoryMySQL();
const passwordHasher = new BcrypHasher_1.BcryptHasher();
const tokenService = new JwtTokenServices_1.JwtTokenService();
const emailService = new EmailService_1.EmailService();
const authControllerV2 = new AuthController_1.AuthController(new RegisterUser_1.RegisterUser(userRepository, passwordHasher, tokenService, emailService), new LoginUser_1.LoginUser(userRepository, passwordHasher, tokenService));
// ============================================================
// EXPRESS APP
// ============================================================
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json({
    verify: (req, _res, buf) => { req.rawBody = buf.toString(); },
}));
app.use(express_1.default.urlencoded({ extended: true }));
// ── Rate limiting ──────────────────────────────────────────────────────────────
const globalLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true });
const sensitiveLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true });
const inventoryLimiter = (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false, skipFailedRequests: true });
app.use('/api', globalLimiter);
app.use('/api/v1/auth', sensitiveLimiter);
app.use('/api/v2/auth', sensitiveLimiter);
app.use('/api/v1/payments', sensitiveLimiter);
// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({
    status: 'ok', env: env_1.env.NODE_ENV, version: '5.0.0',
    timestamp: new Date().toISOString(),
}));
// ============================================================
// RUTAS
// ============================================================
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/players', playerRoutes_1.default);
app.use('/api/v1/auctions', auctionRoutes_1.default);
app.use('/api/v1/missions', missionRoutes_1.default);
app.use('/api/v1/payments', paymentRoutes_1.default);
app.use('/api/v1/cart', cartRoutes_1.default);
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/inventory', inventoryLimiter, (0, inventory_routes_1.createInventoryRoutes)(inventoryController));
app.use('/api/v1', (0, rating_routes_1.createRatingRoutes)(ratingController));
app.use('/api/v2/auth', (0, auth_routes_1.createAuthRoutes)(authControllerV2));
app.use(errorHandler_1.errorHandler);
//heroes
app.use('/api/v1', (0, hero_routes_1.createHeroRoutes)(heroController));
// ============================================================
// ARRANQUE
// ============================================================
async function bootstrap() {
    try {
        // Esta función se importa de ./infrastructure/database/connection
        await (0, connection_1.testConnection)();
        logger_1.logger.info('Conexión a MySQL/TiDB establecida');
        app.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`Servidor corriendo en puerto ${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
            console.log('\n  THE NEXUS BATTLES V — API Unificada');
            console.log('═'.repeat(70));
            console.log(` Servidor: http://localhost:${env_1.env.PORT}`);
            console.log(` Health:   GET http://localhost:${env_1.env.PORT}/health`);
            console.log('═'.repeat(70));
        });
    }
    catch (err) {
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
exports.default = app;
//# sourceMappingURL=server.js.map