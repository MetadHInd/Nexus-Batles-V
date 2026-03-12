import { ResponseStatus } from '../constants/response-status.enum';

export interface AnswerManagerResponse<T> {
  statusCode: number;
  status: ResponseStatus;
  message: string;
  data?: T;
  developmentMessage?: string;
  ms?: number;
}
