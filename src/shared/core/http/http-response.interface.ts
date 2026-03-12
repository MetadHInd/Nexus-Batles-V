export interface BackendResponse<T> {
  statusCode: number;
  status: 'success' | 'error';
  message: string;
  data: T;
  ms?: number;
}

export interface BackendErrorResponse {
  statusCode: number;
  status: 'error';
  message: string;
  developmentMessage?: string;
}
