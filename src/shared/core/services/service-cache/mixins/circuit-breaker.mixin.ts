import { CircuitBreakerHandler } from '../../../../utils/circuit-breaker.handler';

type Constructor<T = object> = new (...args: any[]) => T;

export function WithCircuitBreaker<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public readonly _circuitBreaker = new CircuitBreakerHandler();

    get CircuitBreaker(): CircuitBreakerHandler {
      return this._circuitBreaker;
    }
  };
}
