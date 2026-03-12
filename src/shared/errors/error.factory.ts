import { GenericErrorMessages } from '../constants/generic-error-messages.enum';
import { AppError } from './app-error.type';
import { ErrorMessages } from './error-messages.map';

export class ErrorFactory {
  /**
   * Lanza un error compatible con el sistema de manejo global.
   * @param error Objeto que implementa la interfaz AppError
   */
  static throw(error: AppError): never {
    if (!error || typeof error !== 'object' || !('status' in error)) {
      throw new Error(GenericErrorMessages.INVALID_OBJECT);
    }
    if (!error.message) {
      const status = error.status as keyof typeof ErrorMessages;
      error.message =
        status in ErrorMessages
          ? ErrorMessages[status]
          : GenericErrorMessages.UNKNOWN_ERROR;
    }
    throw new Error(error.message);
  }

  static create(error: AppError): AppError {
    return error;
  }
}
