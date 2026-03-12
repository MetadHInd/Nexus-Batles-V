"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var PlayerController_1 = require("../../controllers/PlayerController");
var router = (0, express_1.Router)();
// GET /api/v1/players/rankings
router.get('/rankings', PlayerController_1.playerController.getRankings.bind(PlayerController_1.playerController));
// GET /api/v1/players/me
router.get('/me', authMiddleware_1.authMiddleware, PlayerController_1.playerController.getMe.bind(PlayerController_1.playerController));
// PATCH /api/v1/players/me
router.patch('/me', authMiddleware_1.authMiddleware, PlayerController_1.playerController.updateMe.bind(PlayerController_1.playerController));
// GET /api/v1/players/me/inventory
router.get('/me/inventory', authMiddleware_1.authMiddleware, PlayerController_1.playerController.getInventory.bind(PlayerController_1.playerController));
// GET /api/v1/players/:id
router.get('/:id', PlayerController_1.playerController.getById.bind(PlayerController_1.playerController));
exports.default = router;
