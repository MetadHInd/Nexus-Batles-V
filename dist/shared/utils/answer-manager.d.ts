import { Response } from 'express';
import { AppError } from '../errors/app-error.type';
import { GenericMessages } from '../constants/generic-messages.enum';
export declare class AnswerManager {
    static handleSuccess<T>(res: Response & {
        ms: number;
    }, data: T, message?: GenericMessages, status?: number): Response<any, Record<string, any>> & {
        ms: number;
    };
    static handleError(res: Response & {
        ms: number;
    }, err: AppError): Response<any, Record<string, any>> & {
        ms: number;
    };
    static handleFieldValidationError(res: Response, err: AppError): Response<any, Record<string, any>>;
}
