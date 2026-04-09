/**
 * paymentMiddlewares.ts
 * Middlewares específicos del módulo de pagos:
 *   - idempotencyRequired
 *   - paymentRateLimiter
 *   - antiFraud
 * Migrados desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
import { Request, Response, NextFunction } from 'express';
export declare function idempotencyRequired(req: Request, res: Response, next: NextFunction): void;
export declare function paymentRateLimiter(options?: {
    windowMs?: number;
    max?: number;
}): (req: Request, res: Response, next: NextFunction) => void;
export declare function antiFraud(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=paymentMiddlewares.d.ts.map