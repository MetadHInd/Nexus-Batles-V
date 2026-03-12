import { Request, Response, NextFunction } from 'express';
export declare class PaymentController {
    createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    processPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    refundPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    webhook(req: Request, res: Response, _next: NextFunction): Promise<void>;
}
export declare const paymentController: PaymentController;
