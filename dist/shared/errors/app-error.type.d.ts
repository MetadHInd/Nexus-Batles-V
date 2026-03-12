export interface AppError {
    status?: number;
    printMessage?: string;
    message?: string;
    ValidationError?: string;
    errors?: any;
    ms?: number;
}
