"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericErrorMessages = void 0;
var GenericErrorMessages;
(function (GenericErrorMessages) {
    GenericErrorMessages["JWT_ENV_TOKEN_MISSING"] = "JWT_SECRET is not defined in the environment variables";
    GenericErrorMessages["INVALID_OBJECT"] = "Invalid object";
    GenericErrorMessages["INVALID_JWT_TOKEN"] = "Invalid Authorization Token";
    GenericErrorMessages["INVALID_CRECENTIALS"] = "Invalid Credentials";
    GenericErrorMessages["PASSWORD_REQUIRED_SIZE"] = "Password must be at least {0} characters long";
    GenericErrorMessages["FORBIDDEN_ACCESS"] = "Forbidden: You don't have access";
    GenericErrorMessages["UNKNOWN_ERROR"] = "Unknown error occurred";
})(GenericErrorMessages || (exports.GenericErrorMessages = GenericErrorMessages = {}));
