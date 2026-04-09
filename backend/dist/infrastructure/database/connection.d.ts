import mysql from 'mysql2/promise';
/**
 * Configuración del Pool de Conexiones para MySQL / TiDB Cloud
 */
export declare const pool: mysql.Pool;
/**
 * Función para validar la salud de la conexión al arrancar el servidor
 */
export declare function testConnection(): Promise<void>;
//# sourceMappingURL=connection.d.ts.map