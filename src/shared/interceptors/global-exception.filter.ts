/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../errors/app-error.type';
import { AnswerManager } from '../utils/answer-manager';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response & { ms: number }>();
    if (res.headersSent) {
      return;
    }
    res.ms = res.ms ?? Date.now();

    let status: number;
    let error: AppError;

    if (
      exception instanceof Error &&
      (exception as any).isValidationError &&
      (exception as any).details
    ) {
      const details = (exception as any).details;
      error = {
        status: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        printMessage: 'Validation failed',
        errors: details,
        ms: Date.now() - res.ms,
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      error = {
        status,
        message:
          typeof response === 'string'
            ? response
            : typeof response === 'object' && 'message' in response
              ? (response as { message: string }).message
              : 'Unknown error',
        printMessage:
          typeof response === 'object' &&
          'printMessage' in response &&
          typeof (response as any).printMessage === 'string'
            ? (response as any).printMessage
            : 'Error',
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      if (process.env.NODE_ENV !== 'production') {
        console.error('🔴 Unhandled exception:', exception);
      }

      error = {
        status,
        message:
          typeof exception === 'object' &&
          exception !== null &&
          'message' in exception
            ? (exception as { message: string }).message
            : 'Internal server error',
        printMessage: 'Unexpected error occurred',
      };
    }

    AnswerManager.handleError(res, error);
  }
}
