import { Request, Response } from "express";
import { ConfirmPurchase } from "../../application/usecases/order/ConfirmPurchase";

export class OrderController {

    constructor(private readonly confirmPurchase: ConfirmPurchase) {}

async confirm(req: Request, res: Response) {
    try {
    if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
    }

    await this.confirmPurchase.execute(req.user.id);

    return res.status(200).json({
        success: true,
        message: "Compra confirmada correctamente"
    });

    } catch (error: any) {
    return res.status(400).json({
        success: false,
        error: error.message
    });
    }
}

}
