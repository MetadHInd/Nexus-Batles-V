"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHttpError = handleHttpError;
const error_codes_enum_1 = require("../../errors/error-codes.enum");
function handleHttpError(error) {
    if (error.response?.data) {
        const errData = error.response.data;
        throw new Error(`[API Error]: ${errData.message}`);
    }
    throw new Error(JSON.stringify({
        statusCode: error_codes_enum_1.ErrorCodesEnum.INTERNAL_SERVER_ERROR,
        status: 'error',
        message: 'Unexpected network error',
        developmentMessage: error.message,
    }));
}
//# sourceMappingURL=http-error-handler.js.map