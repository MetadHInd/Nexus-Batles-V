/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export abstract class HttpClientBase {
  protected client: AxiosInstance;
  protected readonly baseEndpointURI: string;
  protected readonly globalHeaders: Record<string, string> = {
    Accept: 'application/json',
    'App-Version': '1.0.0',
  };

  constructor(baseURL: string) {
    if (!baseURL) {
      throw new Error('Base URL is required to initialize HttpClientBase');
    }
    this.baseEndpointURI = baseURL;

    // En produccion timeout corto (10s), en dev/sandbox timeout largo (60s) para cold starts
    const isProduction = process.env.NODE_ENV === 'production';
    const timeout = isProduction ? 10000 : 30000;

    this.client = axios.create({
      baseURL,
      timeout,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => {
        const errorMessage =
          error.response?.data.message ||
          error.message ||
          'An unknown error occurred';
        return Promise.reject(new Error(errorMessage));
      },
    );
  }

  protected buildURI(endpoint: string): string {
    return `${this.baseEndpointURI.replace(/\/$/, '')}/${endpoint.replace(
      /^\//,
      '',
    )}`;
  }

  protected getHeaders(
    specificHeaders: Record<string, string> = {},
    customHeaders: Record<string, string> = {},
  ): Record<string, string> {
    return {
      ...this.globalHeaders,
      ...specificHeaders,
      ...customHeaders,
    };
  }

  async get<T>(
    endpoint: string,
    customHeaders: Record<string, string> = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const headers = this.getHeaders({}, customHeaders);
    const url = this.buildURI(endpoint);
    console.log(headers);
    const response = await this.client.get<T>(url, { headers, ...config });
    return response.data;
  }

  async post<T>(
    endpoint: string,
    body: any = {},
    customHeaders: Record<string, string> = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const headers = this.getHeaders({}, customHeaders);
    const url = this.buildURI(endpoint);
    console.log(url);
    const response = await this.client.post<T>(url, body, {
      headers,
      ...config,
    });
    console.log('Response from interceptor:', response);
    console.log('Response type:', typeof response);
    return response as T;
  }

  async put<T>(
    endpoint: string,
    body: any = {},
    customHeaders: Record<string, string> = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const headers = this.getHeaders({}, customHeaders);
    const url = this.buildURI(endpoint);
    const response = await this.client.put<T>(url, body, {
      headers,
      ...config,
    });
    return response.data;
  }

  async delete<T>(
    endpoint: string,
    customHeaders: Record<string, string> = {},
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const headers = this.getHeaders({}, customHeaders);
    const url = this.buildURI(endpoint);
    const response = await this.client.delete<T>(url, { headers, ...config });
    return response.data;
  }
}
