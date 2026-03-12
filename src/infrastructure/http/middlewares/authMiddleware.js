"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
var jwt_1 = require("../../security/jwt");
function authMiddleware(req, res, next) {
    var header = req.headers.authorization;
    if (!(header === null || header === void 0 ? void 0 : header.startsWith('Bearer '))) {
        res.status(401).json({ error: 'Token requerido' });
        return;
    }
    try {
        var token = header.slice(7);
        var payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch (_a) {
        res.status(401).json({ error: 'Token invalido o expirado' });
    }
}
function requireRole() {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        var user = req.user;
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ error: 'Permisos insuficientes' });
            return;
        }
        next();
    };
}
