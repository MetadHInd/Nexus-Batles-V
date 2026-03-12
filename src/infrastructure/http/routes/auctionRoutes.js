"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var zod_1 = require("zod");
var validateMiddleware_1 = require("../middlewares/validateMiddleware");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var router = (0, express_1.Router)();
var bidSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
});
var createAuctionSchema = zod_1.z.object({
    itemId: zod_1.z.string().uuid(),
    startPrice: zod_1.z.number().positive(),
    endsAt: zod_1.z.string().datetime(),
});
router.get('/', function (req, res) {
    res.status(501).json({ message: 'Conectar con AuctionController.list' });
});
router.get('/:id', function (req, res) {
    res.status(501).json({ message: 'Conectar con AuctionController.getById' });
});
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)('ADMIN'), (0, validateMiddleware_1.validate)(createAuctionSchema), function (req, res) {
    res.status(501).json({ message: 'Conectar con AuctionController.create' });
});
router.post('/:id/bids', authMiddleware_1.authMiddleware, (0, validateMiddleware_1.validate)(bidSchema), function (req, res) {
    res.status(501).json({ message: 'Conectar con AuctionController.placeBid' });
});
router.delete('/:id', authMiddleware_1.authMiddleware, (0, authMiddleware_1.requireRole)('ADMIN'), function (req, res) {
    res.status(501).json({ message: 'Conectar con AuctionController.cancel' });
});
exports.default = router;
