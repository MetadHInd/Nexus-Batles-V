"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return function (req, res, next) {
        var result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({ error: 'Datos invalidos', details: result.error.flatten().fieldErrors });
            return;
        }
        req.body = result.data;
        next();
    };
}
