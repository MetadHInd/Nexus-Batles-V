import * as CircuitBreaker from 'opossum';
export declare class CircuitBreakerHandler {
    private readonly options;
    createBreaker<T extends (...args: any[]) => Promise<any>>(func: T): CircuitBreaker;
    private logToFile;
}
