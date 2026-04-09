"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.testConnection = testConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("../../config/env");
/**
 * Configuración del Pool de Conexiones para MySQL / TiDB Cloud
 */
exports.pool = promise_1.default.createPool({
    // SUSTITUYE host y port por socketPath:
    //socketPath:        '/tmp/mysql.sock', 
    database: env_1.env.DB_NAME || 'nexus_battles',
    user: env_1.env.DB_USER || 'root',
    password: env_1.env.DB_PASSWORD || '',
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    timezone: 'Z'
    // No necesitas SSL para conexiones por socket local
});
/**
 * Función para validar la salud de la conexión al arrancar el servidor
 */
async function testConnection() {
    const conn = await exports.pool.getConnection();
    try {
        // Una consulta simple para verificar que el túnel SSL y las credenciales funcionan
        await conn.query('SELECT 1');
    }
    finally {
        // Importante: Liberar la conexión de vuelta al pool
        conn.release();
    }
}
//# sourceMappingURL=connection.js.map