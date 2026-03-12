"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = exports.logger = void 0;
const winston_1 = require("winston");
const env_1 = require("../../config/env");
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
exports.audit = {
    login: (userId, ip, success) => exports.logger.info('auth.login', { userId, ip, success }),
    auctionBid: (auctionId, bidderId, amount) => exports.logger.info('auction.bid', { auctionId, bidderId, amount }),
    paymentProcessed: (transactionId, playerId, amount) => exports.logger.info('payment.processed', { transactionId, playerId, amount }),
    missionCompleted: (missionId, playerId, reward) => exports.logger.info('mission.completed', { missionId, playerId, reward }),
    rankChange: (playerId, oldRank, newRank) => exports.logger.info('player.rankChange', { playerId, oldRank, newRank }),
    securityHmacFail: (ip, route) => exports.logger.warn('security.hmacFail', { ip, route, severity: 'HIGH' }),
    rateLimitHit: (ip, route) => exports.logger.warn('security.rateLimitHit', { ip, route }),
};
//# sourceMappingURL=logger.js.map