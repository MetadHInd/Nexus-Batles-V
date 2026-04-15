/**
 * CartController.ts — Infrastructure / HTTP / Controllers
 * FIX: userId ahora se extrae del token JWT (req as any).user.sub,
 *      no de req.body.userId (inseguro).
 */
import { Request, Response } from 'express';
export declare class CartController {
    static add(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=CartController.d.ts.map