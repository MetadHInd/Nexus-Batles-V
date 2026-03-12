"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHMAC = generateHMAC;
exports.validateHMAC = validateHMAC;
var crypto_1 = require("crypto");
var env_1 = require("../../config/env");
/**
 * Genera una firma HMAC-SHA256 para un payload.
 */
function generateHMAC(payload) {
    return crypto_1.default.createHmac('sha256', env_1.env.HMAC_SECRET).update(payload).digest('hex');
}
/**
 * Valida una firma HMAC usando comparacion de tiempo constante
 * para prevenir timing attacks.
 */
function validateHMAC(payload, receivedSignature) {
    var expected = generateHMAC(payload);
    var expectedBuf = Buffer.from(expected, 'hex');
    var receivedBuf = Buffer.from(receivedSignature.replace('sha256=', ''), 'hex');
    if (expectedBuf.length !== receivedBuf.length)
        return false;
    return crypto_1.default.timingSafeEqual(expectedBuf, receivedBuf);
}
