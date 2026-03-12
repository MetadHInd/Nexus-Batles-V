"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CartController_1 = require("../../controllers/CartController");
const router = (0, express_1.Router)();
router.post("/add", CartController_1.CartController.add);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map