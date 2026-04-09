"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemIdSchema = exports.rateItemSchema = void 0;
const zod_1 = require("zod");
exports.rateItemSchema = zod_1.z.object({
    score: zod_1.z
        .number()
        .min(1, 'La calificación debe ser al menos 1 estrella')
        .max(5, 'La calificación no puede ser mayor a 5 estrellas')
});
exports.itemIdSchema = zod_1.z.object({
    itemId: zod_1.z.string().uuid('ID de ítem inválido')
});
//# sourceMappingURL=rating.validator.js.map