"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.testConnection = testConnection;
const promise_1 = require("mysql2/promise");
const env_1 = require("../../config/env");
exports.pool = promise_1.default.createPool({
    host: env_1.env.DB_HOST,
    port: env_1.env.DB_PORT,
    database: env_1.env.DB_NAME,
    user: env_1.env.DB_USER,
    password: env_1.env.DB_PASSWORD,
    connectionLimit: env_1.env.DB_POOL_LIMIT,
    waitForConnections: true,
    queueLimit: 0,
    timezone: 'Z',
});
async function testConnection() {
    const conn = await exports.pool.getConnection();
    await conn.ping();
    conn.release();
}
//# sourceMappingURL=connection.js.map