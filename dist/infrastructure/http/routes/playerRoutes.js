"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const PlayerController_1 = require("../../controllers/PlayerController");
const router = (0, express_1.Router)();
router.get('/rankings', PlayerController_1.playerController.getRankings.bind(PlayerController_1.playerController));
router.get('/me', authMiddleware_1.authMiddleware, PlayerController_1.playerController.getMe.bind(PlayerController_1.playerController));
router.patch('/me', authMiddleware_1.authMiddleware, PlayerController_1.playerController.updateMe.bind(PlayerController_1.playerController));
router.get('/me/inventory', authMiddleware_1.authMiddleware, PlayerController_1.playerController.getInventory.bind(PlayerController_1.playerController));
router.get('/:id', PlayerController_1.playerController.getById.bind(PlayerController_1.playerController));
exports.default = router;
//# sourceMappingURL=playerRoutes.js.map