import { CircuitBreakerHandler } from '../../../../utils/circuit-breaker.handler';
type Constructor<T = object> = new (...args: any[]) => T;
export declare function WithCircuitBreaker<TBase extends Constructor>(Base: TBase): {
    new (...args: any[]): {
        readonly _circuitBreaker: CircuitBreakerHandler;
        get CircuitBreaker(): CircuitBreakerHandler;
    };
} & TBase;
export {};
