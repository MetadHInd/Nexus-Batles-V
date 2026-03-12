"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncMessage = AsyncMessage;
const common_1 = require("@nestjs/common");
function AsyncMessage(description = 'Executing async operation') {
    const logger = new common_1.Logger('AsyncMessage');
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            try {
                logger.debug(`${description} started`);
                const promise = originalMethod.apply(this, args);
                Promise.resolve(promise)
                    .then((result) => {
                    logger.debug(`${description} completed successfully`);
                    return result;
                })
                    .catch((error) => {
                    logger.error(`${description} failed with error: ${error.message}`, error.stack);
                });
                return Promise.resolve({
                    success: true,
                    message: `${description} started asynchronously`,
                    asyncOperation: true,
                });
            }
            catch (error) {
                logger.error(`Failed to start ${description}: ${error.message}`, error.stack);
                return Promise.resolve({
                    success: false,
                    message: `Failed to start ${description}`,
                    error: error.message,
                    asyncOperation: true,
                });
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=async-message.decorator.js.map