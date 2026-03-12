"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorFactory = void 0;
const generic_error_messages_enum_1 = require("../constants/generic-error-messages.enum");
const error_messages_map_1 = require("./error-messages.map");
class ErrorFactory {
    static throw(error) {
        if (!error || typeof error !== 'object' || !('status' in error)) {
            throw new Error(generic_error_messages_enum_1.GenericErrorMessages.INVALID_OBJECT);
        }
        if (!error.message) {
            const status = error.status;
            error.message =
                status in error_messages_map_1.ErrorMessages
                    ? error_messages_map_1.ErrorMessages[status]
                    : generic_error_messages_enum_1.GenericErrorMessages.UNKNOWN_ERROR;
        }
        throw new Error(error.message);
    }
    static create(error) {
        return error;
    }
}
exports.ErrorFactory = ErrorFactory;
//# sourceMappingURL=error.factory.js.map