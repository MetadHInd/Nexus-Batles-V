"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/active', authMiddleware_1.authMiddleware, (req, res) => {
    res.status(501).json({ message: 'Conectar con MissionController.getActive' });
});
router.post('/generate', authMiddleware_1.authMiddleware, (req, res) => {
    res.status(501).json({ message: 'Conectar con MissionController.generate' });
});
router.post('/:id/complete', authMiddleware_1.authMiddleware, (req, res) => {
    res.status(501).json({ message: 'Conectar con MissionController.complete' });
});
router.get('/history', authMiddleware_1.authMiddleware, (req, res) => {
    res.status(501).json({ message: 'Conectar con MissionController.history' });
});
exports.default = router;
//# sourceMappingURL=missionRoutes.js.map