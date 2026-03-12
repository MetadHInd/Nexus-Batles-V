import { AppError } from './app-error.type';
export declare class ErrorFactory {
    static throw(error: AppError): never;
    static create(error: AppError): AppError;
}
