"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helmet_1 = require("helmet");
const cors_1 = require("cors");
const express_rate_limit_1 = require("express-rate-limit");
const env_1 = require("./config/env");
const logger_1 = require("./infrastructure/logging/logger");
const errorHandler_1 = require("./infrastructure/http/middlewares/errorHandler");
const connection_1 = require("./infrastructure/database/connection");
const authRoutes_1 = require("./infrastructure/http/routes/authRoutes");
const auctionRoutes_1 = require("./infrastructure/http/routes/auctionRoutes");
const missionRoutes_1 = require("./infrastructure/http/routes/missionRoutes");
const paymentRoutes_1 = require("./infrastructure/http/routes/paymentRoutes");
const playerRoutes_1 = require("./infrastructure/http/routes/playerRoutes");
const cartRoutes_1 = require("./infrastructure/http/routes/cartRoutes");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json({
    verify: (req, _res, buf) => {
        req.rawBody = buf.toString();
    }
}));
app.use(express_1.default.json());
const globalLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true });
const sensitiveLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true });
app.use('/api', globalLimiter);
app.use('/api/v1/auth', sensitiveLimiter);
app.use('/api/v1/payments', sensitiveLimiter);
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/players', playerRoutes_1.default);
app.use('/api/v1/auctions', auctionRoutes_1.default);
app.use('/api/v1/missions', missionRoutes_1.default);
app.use('/api/v1/payments', paymentRoutes_1.default);
app.use("/api/v1/cart", cartRoutes_1.default);
app.get('/health', (_req, res) => res.json({ status: 'ok', env: env_1.env.NODE_ENV }));
app.use(errorHandler_1.errorHandler);
async function bootstrap() {
    await (0, connection_1.testConnection)();
    logger_1.logger.info('Conexion a MySQL establecida');
    app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Servidor corriendo en puerto ${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
    });
}
bootstrap().catch(err => {
    logger_1.logger.error('Error al iniciar el servidor', { error: err });
    process.exit(1);
});
//# sourceMappingURL=server.js.map