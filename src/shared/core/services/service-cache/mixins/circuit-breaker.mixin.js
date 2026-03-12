"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithCircuitBreaker = WithCircuitBreaker;
var circuit_breaker_handler_1 = require("../../../../utils/circuit-breaker.handler");
function WithCircuitBreaker(Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._circuitBreaker = new circuit_breaker_handler_1.CircuitBreakerHandler();
            return _this;
        }
        Object.defineProperty(class_1.prototype, "CircuitBreaker", {
            get: function () {
                return this._circuitBreaker;
            },
            enumerable: false,
            configurable: true
        });
        return class_1;
    }(Base));
}
