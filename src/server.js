"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var helmet_1 = require("helmet");
var cors_1 = require("cors");
var express_rate_limit_1 = require("express-rate-limit");
var env_1 = require("./config/env");
var logger_1 = require("./infrastructure/logging/logger");
var errorHandler_1 = require("./infrastructure/http/middlewares/errorHandler");
var connection_1 = require("./infrastructure/database/connection");
var authRoutes_1 = require("./infrastructure/http/routes/authRoutes");
var auctionRoutes_1 = require("./infrastructure/http/routes/auctionRoutes");
var missionRoutes_1 = require("./infrastructure/http/routes/missionRoutes");
var paymentRoutes_1 = require("./infrastructure/http/routes/paymentRoutes");
var playerRoutes_1 = require("./infrastructure/http/routes/playerRoutes");
var cartRoutes_1 = require("./infrastructure/http/routes/cartRoutes");
var app = (0, express_1.default)();
// ============ SEGURIDAD PERIMETRAL ============
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
// Capturar raw body para validacion HMAC en webhooks
app.use(express_1.default.json({
    verify: function (req, _res, buf) {
        req.rawBody = buf.toString();
    }
}));
app.use(express_1.default.json());
// Rate limiting global
var globalLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true });
var sensitiveLimiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true });
app.use('/api', globalLimiter);
app.use('/api/v1/auth', sensitiveLimiter);
app.use('/api/v1/payments', sensitiveLimiter);
// ============ RUTAS ============
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/players', playerRoutes_1.default);
app.use('/api/v1/auctions', auctionRoutes_1.default);
app.use('/api/v1/missions', missionRoutes_1.default);
app.use('/api/v1/payments', paymentRoutes_1.default);
app.use("/api/v1/cart", cartRoutes_1.default);
app.get('/health', function (_req, res) { return res.json({ status: 'ok', env: env_1.env.NODE_ENV }); });
// ============ ERROR HANDLER GLOBAL ============
app.use(errorHandler_1.errorHandler);
// ============ ARRANQUE ============
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, connection_1.testConnection)()];
                case 1:
                    _a.sent();
                    logger_1.logger.info('Conexion a MySQL establecida');
                    app.listen(env_1.env.PORT, function () {
                        logger_1.logger.info("Servidor corriendo en puerto ".concat(env_1.env.PORT, " [").concat(env_1.env.NODE_ENV, "]"));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap().catch(function (err) {
    logger_1.logger.error('Error al iniciar el servidor', { error: err });
    process.exit(1);
});
