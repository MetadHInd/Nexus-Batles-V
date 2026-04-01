import mysql from 'mysql2/promise';
import { env } from '../../config/env';

/**
 * Configuración del Pool de Conexiones para MySQL / TiDB Cloud
 */
export const pool = mysql.createPool({
  // SUSTITUYE host y port por socketPath:
  //socketPath:        '/tmp/mysql.sock', 
  
  database:          env.DB_NAME || 'nexus_battles',
  user:              env.DB_USER || 'root',
  password:          env.DB_PASSWORD || '',
  connectionLimit:   10,
  waitForConnections: true,
  queueLimit:        0,
  timezone:          'Z'
  // No necesitas SSL para conexiones por socket local
});

/**
 * Función para validar la salud de la conexión al arrancar el servidor
 */
export async function testConnection(): Promise<void> {
  const conn = await pool.getConnection();
  try {
    // Una consulta simple para verificar que el túnel SSL y las credenciales funcionan
    await conn.query('SELECT 1');
  } finally {
    // Importante: Liberar la conexión de vuelta al pool
    conn.release();
  }
}