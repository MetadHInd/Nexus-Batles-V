"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('3000'),
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.string().transform(Number).default('3306'),
    DB_NAME: zod_1.z.string(),
    DB_USER: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_POOL_LIMIT: zod_1.z.string().transform(Number).default('10'),
    JWT_SECRET: zod_1.z.string().min(64, 'JWT_SECRET debe tener al menos 64 caracteres'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(64),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    HMAC_SECRET: zod_1.z.string().min(32),
    AI_API_KEY: zod_1.z.string(),
    AI_API_URL: zod_1.z.string().url(),
    PAYMENT_API_KEY: zod_1.z.string(),
    PAYMENT_WEBHOOK_SECRET: zod_1.z.string(),
    DEFAULT_PAYMENT_GATEWAY: zod_1.z.enum(['mercadopago', 'stripe', 'mock']).default('mock'),
    APP_BASE_URL: zod_1.z.string().url().optional(),
    REDIS_URL: zod_1.z.string().optional(),
    CORS_ORIGIN: zod_1.z.string(),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Variables de entorno invalidas:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map