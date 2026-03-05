// src/infrastructure/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import { config } from '../../../config/index,';

// Limiter general para rutas no sensibles (muy permisivo)
export const generalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS, // 15 minutos
  max: 500, // 🔴 AUMENTADO de 100 a 500 (config lo sobreescribirá)
  message: 'Demasiadas peticiones, intenta de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔴 NUEVO: Limiter específico para inventario (MUY PERMISIVO)
export const inventoryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 120, // 120 peticiones por minuto (2 por segundo)
  message: {
    error: 'Demasiadas solicitudes al inventario. Espera un momento.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true, // No contar peticiones fallidas
});

// Limiter para login (más restrictivo)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // 50 intentos por 15 minutos
  message: 'Demasiados intentos de login',
  skipSuccessfulRequests: true,
});

// Limiter para operaciones sensibles (delete, update)
export const sensitiveOperationsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Límite de operaciones sensibles alcanzado',
});