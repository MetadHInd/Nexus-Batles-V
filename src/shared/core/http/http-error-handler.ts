import { AxiosError } from 'axios';
import { BackendErrorResponse } from './http-response.interface';
import { ErrorCodesEnum } from 'src/shared/errors/error-codes.enum';

export function handleHttpError(error: AxiosError): never {
  if (error.response?.data) {
    const errData = error.response.data as BackendErrorResponse;
    throw new Error(`[API Error]: ${errData.message}`);
  }

  throw new Error(
    JSON.stringify({
      statusCode: ErrorCodesEnum.INTERNAL_SERVER_ERROR,
      status: 'error',
      message: 'Unexpected network error',
      developmentMessage: error.message,
    }),
  );
}
