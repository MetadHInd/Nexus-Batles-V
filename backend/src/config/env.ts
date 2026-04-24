// C:\Users\caren\Downloads\Nexus-Batles-V-main-bien\Nexus-Batles-V-main\backend\src\config\env.ts
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const env = {
  // Servidor
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Base de datos
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_NAME: process.env.DB_NAME || 'nexus_battles',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'Caren200505',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'nexus_secret_key_2024',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'nexus_refresh_secret_2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d', // ✅ Agregar esta línea
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d', // ✅ Agregar esta línea
  
  // HMAC
  HMAC_SECRET: process.env.HMAC_SECRET || 'nexus_hmac_secret_2024',
  
  // AI
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_API_URL: process.env.AI_API_URL || 'http://localhost:8000',
  
  // Payment
  PAYMENT_API_KEY: process.env.PAYMENT_API_KEY || '',
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || '',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export default env;