export declare class DomainError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
export declare class ValidationError extends DomainError {
    constructor(message: string);
}
export declare class NotFoundError extends DomainError {
    constructor(resource: string);
}
export declare class AuthorizationError extends DomainError {
    constructor(message?: string);
}
export declare class ConflictError extends DomainError {
    constructor(message: string);
}
