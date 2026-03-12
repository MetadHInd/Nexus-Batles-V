"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const AuthController_1 = require("../../controllers/AuthController");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(72),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
router.post('/register', (0, validateMiddleware_1.validate)(registerSchema), AuthController_1.authController.register.bind(AuthController_1.authController));
router.post('/login', (0, validateMiddleware_1.validate)(loginSchema), AuthController_1.authController.login.bind(AuthController_1.authController));
router.post('/logout', AuthController_1.authController.logout.bind(AuthController_1.authController));
router.post('/refresh', AuthController_1.authController.refresh.bind(AuthController_1.authController));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map