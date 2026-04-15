"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminChatbotRoutes = void 0;
const express_1 = require("express");
const adminChatbotAuth_middleware_1 = require("../middlewares/adminChatbotAuth.middleware");
const autoBackupMiddleware_1 = __importDefault(require("../middlewares/autoBackupMiddleware"));
const createAdminChatbotRoutes = (controller) => {
    const router = (0, express_1.Router)();
    router.post('/login', controller.login);
    router.use(adminChatbotAuth_middleware_1.adminChatbotAuthMiddleware);
    router.post('/logout', controller.logout);
    router.get('/knowledge-base', controller.listKnowledgeBase);
    router.get('/knowledge-base/:category', controller.getKnowledgeBaseByCategory);
    // ── Operaciones con backup automático preventivo ────────────────────────────
    // Antes de crear, editar o eliminar, se ejecuta un backup completo de BD
    router.post('/knowledge-base/:category', autoBackupMiddleware_1.default, controller.createKnowledgeBaseEntry);
    router.put('/knowledge-base/:category/:id', autoBackupMiddleware_1.default, controller.updateKnowledgeBaseEntry);
    router.delete('/knowledge-base/:category/:id', autoBackupMiddleware_1.default, controller.deleteKnowledgeBaseEntry);
    // ── Monitoreo de backups y auditoría ────────────────────────────────────────
    router.get('/logs', controller.getLogs);
    router.get('/backups', controller.getBackups);
    return router;
};
exports.createAdminChatbotRoutes = createAdminChatbotRoutes;
//# sourceMappingURL=adminChatbot.routes.js.map