"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminChatbotRoutes = void 0;
const express_1 = require("express");
const adminChatbotAuth_middleware_1 = require("../middlewares/adminChatbotAuth.middleware");
const createAdminChatbotRoutes = (controller) => {
    const router = (0, express_1.Router)();
    router.post('/login', controller.login);
    router.use(adminChatbotAuth_middleware_1.adminChatbotAuthMiddleware);
    router.post('/logout', controller.logout);
    router.get('/knowledge-base', controller.listKnowledgeBase);
    router.get('/knowledge-base/:category', controller.getKnowledgeBaseByCategory);
    router.post('/knowledge-base/:category', controller.createKnowledgeBaseEntry);
    router.put('/knowledge-base/:category/:id', controller.updateKnowledgeBaseEntry);
    router.delete('/knowledge-base/:category/:id', controller.deleteKnowledgeBaseEntry);
    router.get('/logs', controller.getLogs);
    return router;
};
exports.createAdminChatbotRoutes = createAdminChatbotRoutes;
//# sourceMappingURL=adminChatbot.routes.js.map