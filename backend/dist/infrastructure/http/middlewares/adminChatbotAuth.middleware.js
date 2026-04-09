"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminChatbotSession = createAdminChatbotSession;
exports.destroyAdminChatbotSession = destroyAdminChatbotSession;
exports.adminChatbotAuthMiddleware = adminChatbotAuthMiddleware;
const crypto_1 = require("crypto");
const adminChatbotSessions = new Map();
function createAdminChatbotSession(username) {
    const token = (0, crypto_1.randomUUID)();
    adminChatbotSessions.set(token, { username, createdAt: new Date().toISOString() });
    return token;
}
function destroyAdminChatbotSession(token) {
    adminChatbotSessions.delete(token);
}
function extractAdminChatbotToken(req) {
    const headerToken = req.header('x-admin-session');
    if (headerToken) {
        return headerToken;
    }
    const authHeader = req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.slice(7);
}
function adminChatbotAuthMiddleware(req, res, next) {
    const token = extractAdminChatbotToken(req);
    if (!token) {
        res.status(401).json({
            success: false,
            error: 'ADMIN_AUTH_REQUIRED',
            message: 'Debes iniciar sesión como administrador para acceder a este recurso.',
        });
        return;
    }
    const session = adminChatbotSessions.get(token);
    if (!session) {
        res.status(401).json({
            success: false,
            error: 'ADMIN_SESSION_INVALID',
            message: 'La sesión de administrador no es válida o expiró. Inicia sesión nuevamente.',
        });
        return;
    }
    req.admin = { username: session.username };
    next();
}
//# sourceMappingURL=adminChatbotAuth.middleware.js.map