"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const answer_manager_1 = require("../utils/answer-manager");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        if (res.headersSent) {
            return;
        }
        res.ms = res.ms ?? Date.now();
        let status;
        let error;
        if (exception instanceof Error &&
            exception.isValidationError &&
            exception.details) {
            const details = exception.details;
            error = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Validation failed',
                printMessage: 'Validation failed',
                errors: details,
                ms: Date.now() - res.ms,
            };
        }
        else if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();
            error = {
                status,
                message: typeof response === 'string'
                    ? response
                    : typeof response === 'object' && 'message' in response
                        ? response.message
                        : 'Unknown error',
                printMessage: typeof response === 'object' &&
                    'printMessage' in response &&
                    typeof response.printMessage === 'string'
                    ? response.printMessage
                    : 'Error',
            };
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            if (process.env.NODE_ENV !== 'production') {
                console.error('🔴 Unhandled exception:', exception);
            }
            error = {
                status,
                message: typeof exception === 'object' &&
                    exception !== null &&
                    'message' in exception
                    ? exception.message
                    : 'Internal server error',
                printMessage: 'Unexpected error occurred',
            };
        }
        answer_manager_1.AnswerManager.handleError(res, error);
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map