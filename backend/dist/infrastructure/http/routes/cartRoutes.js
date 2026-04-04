"use strict";
/**
 * cartRoutes.ts — Infrastructure / HTTP / Routes
 * FIX: import de CartController corregido a '../controllers/CartController'
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CartController_1 = require("../controllers/CartController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/add', authMiddleware_1.authMiddleware, CartController_1.CartController.add);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map