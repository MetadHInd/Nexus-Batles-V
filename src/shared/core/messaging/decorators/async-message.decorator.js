"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncMessage = AsyncMessage;
// src/shared/core/messaging/decorators/async-message.decorator.ts
var common_1 = require("@nestjs/common");
/**
 * Decorador que permite ejecutar métodos de envío de mensajes de forma asíncrona
 * sin esperar su resolución, pero manejando los errores de forma segura.
 *
 * @example
 * class MyService {
 *   @AsyncMessage('Enviando email de bienvenida')
 *   async sendWelcomeEmail(user: User) {
 *     // Este método se ejecutará de forma asíncrona y sus errores se manejarán automáticamente
 *     return await this.emailService.send(...);
 *   }
 * }
 */
function AsyncMessage(description) {
    if (description === void 0) { description = 'Executing async operation'; }
    var logger = new common_1.Logger('AsyncMessage');
    return function (target, propertyKey, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Ejecutar el método original sin esperar su resolución
            try {
                logger.debug("".concat(description, " started"));
                // Ejecutar el método original y manejar los errores
                var promise = originalMethod.apply(this, args);
                // Manejar la promesa sin bloquear la ejecución
                Promise.resolve(promise)
                    .then(function (result) {
                    logger.debug("".concat(description, " completed successfully"));
                    return result;
                })
                    .catch(function (error) {
                    logger.error("".concat(description, " failed with error: ").concat(error.message), error.stack);
                });
                // Retornar una promesa resuelta inmediatamente para no bloquear
                return Promise.resolve({
                    success: true,
                    message: "".concat(description, " started asynchronously"),
                    asyncOperation: true,
                });
            }
            catch (error) {
                logger.error("Failed to start ".concat(description, ": ").concat(error.message), error.stack);
                return Promise.resolve({
                    success: false,
                    message: "Failed to start ".concat(description),
                    error: error.message,
                    asyncOperation: true,
                });
            }
        };
        return descriptor;
    };
}
