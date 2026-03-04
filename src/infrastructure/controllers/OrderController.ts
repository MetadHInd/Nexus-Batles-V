import { Request, Response } from "express";
import { ConfirmPurchase } from "../../application/usecases/order/ConfirmPurchase";

export class OrderController {
    constructor(private readonly confirmPurchase: ConfirmPurchase) {}

    async confirm(req: Request, res: Response) {
    try {
      const userId = req.user.id; // depende de tu auth middleware

        await this.confirmPurchase.execute(userId);

        res.status(200).json({ message: "Compra confirmada correctamente" });

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
    }
}