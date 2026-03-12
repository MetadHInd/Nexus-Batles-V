import { applyDecorators, UseGuards } from '@nestjs/common';
import { SSEAuthGuard } from '../guards/sse-auth.guard';
import { SSERateLimitGuard } from '../guards/sse-rate-limit.guard';

/**
 * Decorator para aplicar seguridad completa a endpoints SSE
 * 
 * Aplica:
 * - SSEAuthGuard (validación de JWT)
 * - SSERateLimitGuard (rate limiting)
 * 
 * @example
 * ```typescript
 * @SSESecure()
 * @Sse('stream')
 * streamEvents() { ... }
 * ```
 */
export function SSESecure() {
  return applyDecorators(
    UseGuards(SSERateLimitGuard, SSEAuthGuard),
  );
}

/**
 * Decorator solo para autenticación SSE
 * 
 * @example
 * ```typescript
 * @SSEAuth()
 * @Sse('stream')
 * streamEvents() { ... }
 * ```
 */
export function SSEAuth() {
  return applyDecorators(
    UseGuards(SSEAuthGuard),
  );
}

/**
 * Decorator solo para rate limiting SSE
 * 
 * @example
 * ```typescript
 * @SSERateLimit()
 * @Sse('stream')
 * streamEvents() { ... }
 * ```
 */
export function SSERateLimit() {
  return applyDecorators(
    UseGuards(SSERateLimitGuard),
  );
}
