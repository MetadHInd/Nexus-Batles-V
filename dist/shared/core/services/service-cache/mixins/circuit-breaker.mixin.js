"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithCircuitBreaker = WithCircuitBreaker;
const circuit_breaker_handler_1 = require("../../../../utils/circuit-breaker.handler");
function WithCircuitBreaker(Base) {
    return class extends Base {
        _circuitBreaker = new circuit_breaker_handler_1.CircuitBreakerHandler();
        get CircuitBreaker() {
            return this._circuitBreaker;
        }
    };
}
//# sourceMappingURL=circuit-breaker.mixin.js.map