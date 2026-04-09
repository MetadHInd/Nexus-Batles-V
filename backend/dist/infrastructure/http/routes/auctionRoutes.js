"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const bidSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
});
const createAuctionSchema = zod_1.z.object({
    itemId: zod_1.z.string().uuid(),
    startPrice: zod_1.z.number().positive(),
    endsAt: zod_1.z.string().datetime(),
});
router.get('/', (req, res) => {
    res.status(501).json({ message: 'Conectar con AuctionController.list' });
});
router.get('/:id', (req, res) => {
    res.status(501).json({ message: 'Conectar con AuctionController.getById' });
});
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)('ADMIN'), (0, validateMiddleware_1.validate)(createAuctionSchema), (req, res) => {
    res.status(501).json({ message: 'Conectar con AuctionController.create' });
});
router.post('/:id/bids', authMiddleware_1.authMiddleware, (0, validateMiddleware_1.validate)(bidSchema), (req, res) => {
    res.status(501).json({ message: 'Conectar con AuctionController.placeBid' });
});
router.delete('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)('ADMIN'), (req, res) => {
    res.status(501).json({ message: 'Conectar con AuctionController.cancel' });
});
exports.default = router;
//# sourceMappingURL=auctionRoutes.js.map