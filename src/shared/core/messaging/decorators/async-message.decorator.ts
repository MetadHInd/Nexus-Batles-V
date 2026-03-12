// src/shared/core/messaging/decorators/async-message.decorator.ts
import { Logger } from '@nestjs/common';

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
export function AsyncMessage(
  description: string = 'Executing async operation',
) {
  const logger = new Logger('AsyncMessage');

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // Ejecutar el método original sin esperar su resolución
      try {
        logger.debug(`${description} started`);

        // Ejecutar el método original y manejar los errores
        const promise = originalMethod.apply(this, args);

        // Manejar la promesa sin bloquear la ejecución
        Promise.resolve(promise)
          .then((result) => {
            logger.debug(`${description} completed successfully`);
            return result;
          })
          .catch((error) => {
            logger.error(
              `${description} failed with error: ${error.message}`,
              error.stack,
            );
          });

        // Retornar una promesa resuelta inmediatamente para no bloquear
        return Promise.resolve({
          success: true,
          message: `${description} started asynchronously`,
          asyncOperation: true,
        });
      } catch (error) {
        logger.error(
          `Failed to start ${description}: ${error.message}`,
          error.stack,
        );

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
