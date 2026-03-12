"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerManager = void 0;
const error_codes_enum_1 = require("../errors/error-codes.enum");
const error_messages_map_1 = require("../errors/error-messages.map");
const response_status_enum_1 = require("../constants/response-status.enum");
const generic_messages_enum_1 = require("../constants/generic-messages.enum");
class AnswerManager {
    static handleSuccess(res, data, message = generic_messages_enum_1.GenericMessages.OPERATION_SUCCESSFULL, status = error_codes_enum_1.ErrorCodesEnum.OK) {
        const msTime = Date.now() - res.ms;
        const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return {};
                    }
                    seen.add(value);
                }
                return value;
            };
        };
        let cleanData;
        try {
            cleanData = JSON.parse(JSON.stringify(data, getCircularReplacer()));
        }
        catch (error) {
            console.warn('Warning: Could not clean circular references from response data');
            cleanData = data;
        }
        const response = {
            statusCode: status,
            status: response_status_enum_1.ResponseStatus.SUCCESS,
            message,
            data: cleanData,
            ms: msTime,
        };
        return res.status(status).json(response);
    }
    static handleError(res, err) {
        const msTime = Date.now() - res.ms;
        const statusCode = err.status ?? error_codes_enum_1.ErrorCodesEnum.INTERNAL_SERVER_ERROR;
        let devMessage;
        if (err.message !== undefined && typeof err.message === 'string') {
            devMessage = err.message;
        }
        else if (error_messages_map_1.ErrorMessages[statusCode] !== undefined) {
            devMessage = error_messages_map_1.ErrorMessages[statusCode] ?? generic_messages_enum_1.GenericMessages.UNKNOWN_ERROR;
        }
        else {
            devMessage = generic_messages_enum_1.GenericMessages.UNKNOWN_ERROR;
        }
        const response = {
            statusCode,
            status: response_status_enum_1.ResponseStatus.ERROR,
            message: err.printMessage ?? generic_messages_enum_1.GenericMessages.UNKNOWN_ERROR,
            developmentMessage: devMessage,
            ms: msTime,
            ...(err.errors ? { errors: err.errors } : {}),
        };
        return res.status(statusCode).json(response);
    }
    static handleFieldValidationError(res, err) {
        const statusCode = error_codes_enum_1.ErrorCodesEnum.FIELDS_MISSING;
        const message = error_messages_map_1.ErrorMessages[statusCode] ?? generic_messages_enum_1.GenericMessages.UNKNOWN_ERROR;
        const response = {
            statusCode,
            status: response_status_enum_1.ResponseStatus.ERROR,
            message,
        };
        if (process.env.NODE_ENV === 'development') {
            response.developmentMessage = err?.ValidationError || message;
        }
        return res.status(statusCode).json(response);
    }
}
exports.AnswerManager = AnswerManager;
//# sourceMappingURL=answer-manager.js.map