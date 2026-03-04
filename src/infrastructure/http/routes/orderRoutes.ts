import { Router } from "express";
import { OrderController } from "../../controllers/OrderController";
import { ConfirmPurchase } from "../../../application/usecases/order/ConfirmPurchase";
import { MySQLCartRepository } from "../../repositories/MySQLCartRepository";
import { MySQLProductRepository } from "../../repositories/MySQLProductRepository";
import { MySQLOrderRepository } from "../../repositories/MySQLOrderRepository";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();

// 🔹 Repositories
const cartRepository = new MySQLCartRepository();
const productRepository = new MySQLProductRepository();
const orderRepository = new MySQLOrderRepository();

// 🔹 UseCase
const confirmPurchase = new ConfirmPurchase(
    cartRepository,
    productRepository,
    orderRepository
);

// 🔹 Controller
const orderController = new OrderController(confirmPurchase);

// 🔹 Ruta protegida
router.post(
    "/confirm",
    authMiddleware,
    orderController.confirm.bind(orderController)
);

export default router;