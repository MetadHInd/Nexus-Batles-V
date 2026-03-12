import { AxiosInstance, AxiosRequestConfig } from 'axios';
export declare abstract class HttpClientBase {
    protected client: AxiosInstance;
    protected readonly baseEndpointURI: string;
    protected readonly globalHeaders: Record<string, string>;
    constructor(baseURL: string);
    private setupInterceptors;
    protected buildURI(endpoint: string): string;
    protected getHeaders(specificHeaders?: Record<string, string>, customHeaders?: Record<string, string>): Record<string, string>;
    get<T>(endpoint: string, customHeaders?: Record<string, string>, config?: AxiosRequestConfig): Promise<T>;
    post<T>(endpoint: string, body?: any, customHeaders?: Record<string, string>, config?: AxiosRequestConfig): Promise<T>;
    put<T>(endpoint: string, body?: any, customHeaders?: Record<string, string>, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(endpoint: string, customHeaders?: Record<string, string>, config?: AxiosRequestConfig): Promise<T>;
}
