"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRatingRoutes = void 0;
// src/interfaces/routes/rating.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const createRatingRoutes = (controller) => {
    const router = (0, express_1.Router)();
    // Rutas públicas - cualquiera puede ver calificaciones
    router.get('/products/:id/rating', controller.getProductRating);
    // Rutas protegidas - solo usuarios autenticados pueden calificar
    router.post('/products/:id/rate', auth_middleware_1.authenticateJWT, controller.rateProduct);
    return router;
};
exports.createRatingRoutes = createRatingRoutes;
//# sourceMappingURL=rating.routes.js.map