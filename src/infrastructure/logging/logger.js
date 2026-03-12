"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = exports.logger = void 0;
var winston_1 = require("winston");
var env_1 = require("../../config/env");
exports.logger = winston_1.default.createLogger({
    level: env_1.env.LOG_LEVEL,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    defaultMeta: { service: 'nexus-battles-v' },
    transports: [
        new winston_1.default.transports.Console({
            format: env_1.env.NODE_ENV === 'development'
                ? winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
                : winston_1.default.format.json(),
        }),
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/audit.log', level: 'info' }),
    ],
});
// Helpers de auditoria
exports.audit = {
    login: function (userId, ip, success) {
        return exports.logger.info('auth.login', { userId: userId, ip: ip, success: success });
    },
    auctionBid: function (auctionId, bidderId, amount) {
        return exports.logger.info('auction.bid', { auctionId: auctionId, bidderId: bidderId, amount: amount });
    },
    paymentProcessed: function (transactionId, playerId, amount) {
        return exports.logger.info('payment.processed', { transactionId: transactionId, playerId: playerId, amount: amount });
    },
    missionCompleted: function (missionId, playerId, reward) {
        return exports.logger.info('mission.completed', { missionId: missionId, playerId: playerId, reward: reward });
    },
    rankChange: function (playerId, oldRank, newRank) {
        return exports.logger.info('player.rankChange', { playerId: playerId, oldRank: oldRank, newRank: newRank });
    },
    securityHmacFail: function (ip, route) {
        return exports.logger.warn('security.hmacFail', { ip: ip, route: route, severity: 'HIGH' });
    },
    rateLimitHit: function (ip, route) {
        return exports.logger.warn('security.rateLimitHit', { ip: ip, route: route });
    },
};
