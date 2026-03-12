"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmacMiddleware = hmacMiddleware;
var hmac_1 = require("../../security/hmac");
var REPLAY_WINDOW_MS = 5 * 60 * 1000; // 5 minutos
function hmacMiddleware(req, res, next) {
    var _a, _b;
    var signature = req.headers['x-signature'];
    var timestamp = req.headers['x-timestamp'];
    if (!signature || !timestamp) {
        res.status(401).json({ error: 'Firma y timestamp requeridos' });
        return;
    }
    // Proteccion contra replay attacks
    var ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Date.now() - ts > REPLAY_WINDOW_MS) {
        res.status(401).json({ error: 'Timestamp fuera de ventana permitida' });
        return;
    }
    var rawBody = (_b = (_a = req.rawBody) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : JSON.stringify(req.body);
    var payload = "".concat(timestamp, ".").concat(rawBody);
    if (!(0, hmac_1.validateHMAC)(payload, signature)) {
        res.status(401).json({ error: 'Firma HMAC invalida' });
        return;
    }
    next();
}
