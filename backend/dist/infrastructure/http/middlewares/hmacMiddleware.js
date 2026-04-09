"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmacMiddleware = hmacMiddleware;
const hmac_1 = require("../../security/hmac");
const REPLAY_WINDOW_MS = 5 * 60 * 1000; // 5 minutos
function hmacMiddleware(req, res, next) {
    const signature = req.headers['x-signature'];
    const timestamp = req.headers['x-timestamp'];
    if (!signature || !timestamp) {
        res.status(401).json({ error: 'Firma y timestamp requeridos' });
        return;
    }
    // Proteccion contra replay attacks
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Date.now() - ts > REPLAY_WINDOW_MS) {
        res.status(401).json({ error: 'Timestamp fuera de ventana permitida' });
        return;
    }
    const rawBody = req.rawBody?.toString() ?? JSON.stringify(req.body);
    const payload = `${timestamp}.${rawBody}`;
    if (!(0, hmac_1.validateHMAC)(payload, signature)) {
        res.status(401).json({ error: 'Firma HMAC invalida' });
        return;
    }
    next();
}
//# sourceMappingURL=hmacMiddleware.js.map