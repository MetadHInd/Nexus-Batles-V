/**
 * PaymentController.ts — Infrastructure / Controllers
 * Orquesta los use cases de pagos.
 * Recibe HTTP, delega en use cases y responde.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */
import { Request, Response, NextFunction } from 'express';
export declare class PaymentController {
    createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    processPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    refundPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    webhook(req: Request, res: Response, _next: NextFunction): Promise<void>;
}
export declare const paymentController: PaymentController;
//# sourceMappingURL=PaymentController.d.ts.map