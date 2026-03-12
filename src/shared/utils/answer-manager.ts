import { Response } from 'express';
import { ErrorCodesEnum } from '../errors/error-codes.enum';
import { ErrorMessages } from '../errors/error-messages.map';
import { AppError } from '../errors/app-error.type';
import { ResponseStatus } from '../constants/response-status.enum';
import { GenericMessages } from '../constants/generic-messages.enum';
import { AnswerManagerResponse } from '../interfaces/answer-manager-response.interface';

export class AnswerManager {
  static handleSuccess<T>(
    res: Response & { ms: number },
    data: T,
    message = GenericMessages.OPERATION_SUCCESSFULL,
    status: number = ErrorCodesEnum.OK,
  ) {
    const msTime = Date.now() - res.ms;

    // Helper function to handle circular references
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key: string, value: any) => {
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
    let cleanData: T;
    try {
      cleanData = JSON.parse(JSON.stringify(data, getCircularReplacer()));
    } catch (error) {
      // If still fails, just use the data as-is and let Express handle it
      console.warn('Warning: Could not clean circular references from response data');
      cleanData = data;
    }

    const response: AnswerManagerResponse<T> = {
      statusCode: status,
      status: ResponseStatus.SUCCESS,
      message,
      data: cleanData,
      ms: msTime,
    };

    return res.status(status).json(response);
  }

  static handleError(res: Response & { ms: number }, err: AppError) {
    const msTime = Date.now() - res.ms;

    const statusCode = err.status ?? ErrorCodesEnum.INTERNAL_SERVER_ERROR;

    let devMessage: string;
    if (err.message !== undefined && typeof err.message === 'string') {
      devMessage = err.message;
    } else if (ErrorMessages[statusCode] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      devMessage = ErrorMessages[statusCode] ?? GenericMessages.UNKNOWN_ERROR;
    } else {
      devMessage = GenericMessages.UNKNOWN_ERROR;
    }

    const response: AnswerManagerResponse<null> = {
      statusCode,
      status: ResponseStatus.ERROR,
      message: err.printMessage ?? GenericMessages.UNKNOWN_ERROR,
      developmentMessage: devMessage,
      ms: msTime,
      ...(err.errors ? { errors: err.errors } : {}),
    };

    return res.status(statusCode).json(response);
  }

  static handleFieldValidationError(res: Response, err: AppError) {
    const statusCode = ErrorCodesEnum.FIELDS_MISSING;
    const message = ErrorMessages[statusCode] ?? GenericMessages.UNKNOWN_ERROR;

    const response: AnswerManagerResponse<null> = {
      statusCode,
      status: ResponseStatus.ERROR,
      message,
    };

    if (process.env.NODE_ENV === 'development') {
      response.developmentMessage = err?.ValidationError || message;
    }

    return res.status(statusCode).json(response);
  }
}
