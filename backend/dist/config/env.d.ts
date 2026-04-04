export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_POOL_LIMIT: number;
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    HMAC_SECRET: string;
    AI_API_KEY: string;
    AI_API_URL: string;
    PAYMENT_API_KEY: string;
    PAYMENT_WEBHOOK_SECRET: string;
    DEFAULT_PAYMENT_GATEWAY: "mercadopago" | "stripe" | "mock";
    CORS_ORIGIN: string;
    LOG_LEVEL: "error" | "warn" | "info" | "debug";
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
    APP_BASE_URL?: string | undefined;
    REDIS_URL?: string | undefined;
};
//# sourceMappingURL=env.d.ts.map