"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHttpError = handleHttpError;
var error_codes_enum_1 = require("../../../../../../../../src/shared/errors/error-codes.enum");
function handleHttpError(error) {
    var _a;
    if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
        var errData = error.response.data;
        throw new Error("[API Error]: ".concat(errData.message));
    }
    throw new Error(JSON.stringify({
        statusCode: error_codes_enum_1.ErrorCodesEnum.INTERNAL_SERVER_ERROR,
        status: 'error',
        message: 'Unexpected network error',
        developmentMessage: error.message,
    }));
}
