"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerManager = void 0;
var error_codes_enum_1 = require("../errors/error-codes.enum");
var error_messages_map_1 = require("../errors/error-messages.map");
var response_status_enum_1 = require("../constants/response-status.enum");
var generic_messages_enum_1 = require("../constants/generic-messages.enum");
var AnswerManager = /** @class */ (function () {
    function AnswerManager() {
    }
    AnswerManager.handleSuccess = function (res, data, message, status) {
        if (message === void 0) { message = generic_messages_enum_1.GenericMessages.OPERATION_SUCCESSFULL; }
        if (status === void 0) { status = error_codes_enum_1.ErrorCodesEnum.OK; }
        var msTime = Date.now() - res.ms;
        // Helper function to handle circular references
        var getCircularReplacer = function () {
            var seen = new WeakSet();
            return function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return {};
                    }
                    seen.add(value);
                }
                return value;
            };
        };
        // Clean data to avoid circular references
        var cleanData;
        try {
            cleanData = JSON.parse(JSON.stringify(data, getCircularReplacer()));
        }
        catch (error) {
            // If still fails, just use the data as-is and let Express handle it
            console.warn('Warning: Could not clean circular references from response data');
            cleanData = data;
        }
        var response = {
            statusCode: status,
            status: response_status_enum_1.ResponseStatus.SUCCESS,
            message: message,
            data: cleanData,
            ms: msTime,
        };
        return res.status(status).json(response);
    };
    AnswerManager.handleError = function (res, err) {
        var _a, _b, _c;
        var msTime = Date.now() - res.ms;
        var statusCode = (_a = err.status) !== null && _a !== void 0 ? _a : error_codes_enum_1.ErrorCodesEnum.INTERNAL_SERVER_ERROR;
        var devMessage;
        if (err.message !== undefined && typeof err.message === 'string') {
            devMessage = err.message;
        }
        else if (error_messages_map_1.ErrorMessages[statusCode] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            devMessage = (_b = error_messages_map_1.ErrorMessages[statusCode]) !== null && _b !== void 0 ? _b : generic_messages_enum_1.GenericMessages.UNKNOWN_ERROR;
        }
        else {
            devMessage = generic_messages_enum_1.GenericMessages.UNKNOWN_ERROR;
        }
        var response = __assign({ statusCode: statusCode, status: response_status_enum_1.ResponseStatus.ERROR, message: (_c = err.printMessage) !== null && _c !== void 0 ? _c : generic_messages_enum_1.GenericMessages.UNKNOWN_ERROR, developmentMessage: devMessage, ms: msTime }, (err.errors ? { errors: err.errors } : {}));
        return res.status(statusCode).json(response);
    };
    AnswerManager.handleFieldValidationError = function (res, err) {
        var _a;
        var statusCode = error_codes_enum_1.ErrorCodesEnum.FIELDS_MISSING;
        var message = (_a = error_messages_map_1.ErrorMessages[statusCode]) !== null && _a !== void 0 ? _a : generic_messages_enum_1.GenericMessages.UNKNOWN_ERROR;
        var response = {
            statusCode: statusCode,
            status: response_status_enum_1.ResponseStatus.ERROR,
            message: message,
        };
        if (process.env.NODE_ENV === 'development') {
            response.developmentMessage = (err === null || err === void 0 ? void 0 : err.ValidationError) || message;
        }
        return res.status(statusCode).json(response);
    };
    return AnswerManager;
}());
exports.AnswerManager = AnswerManager;
