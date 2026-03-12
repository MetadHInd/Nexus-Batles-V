"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = void 0;
var generic_error_messages_enum_1 = require("../constants/generic-error-messages.enum");
var error_messages_map_1 = require("./error-messages.map");
var ErrorFactory = /** @class */ (function () {
    function ErrorFactory() {
    }
    /**
     * Lanza un error compatible con el sistema de manejo global.
     * @param error Objeto que implementa la interfaz AppError
     */
    ErrorFactory.throw = function (error) {
        if (!error || typeof error !== 'object' || !('status' in error)) {
            throw new Error(generic_error_messages_enum_1.GenericErrorMessages.INVALID_OBJECT);
        }
        if (!error.message) {
            var status_1 = error.status;
            error.message =
                status_1 in error_messages_map_1.ErrorMessages
                    ? error_messages_map_1.ErrorMessages[status_1]
                    : generic_error_messages_enum_1.GenericErrorMessages.UNKNOWN_ERROR;
        }
        throw new Error(error.message);
    };
    ErrorFactory.create = function (error) {
        return error;
    };
    return ErrorFactory;
}());
exports.ErrorFactory = ErrorFactory;
