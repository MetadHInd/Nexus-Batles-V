"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreakerHandler = void 0;
const common_1 = require("@nestjs/common");
const CircuitBreaker = require("opossum");
const fs = require("fs");
const path = require("path");
let CircuitBreakerHandler = class CircuitBreakerHandler {
    options = {
        timeout: 3000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000,
    };
    createBreaker(func) {
        const breaker = new CircuitBreaker(func, this.options);
        breaker.fallback(async () => {
            await this.logToFile('⚠️ Circuit open. Using fallback.');
        });
        breaker.on('failure', async (error) => {
            await this.logToFile(`❌ Action failed: ${error}`);
        });
        breaker.on('open', async () => {
            await this.logToFile('🔌 Circuit has been opened.');
        });
        breaker.on('close', async () => {
            await this.logToFile('✅ Circuit has been closed.');
        });
        breaker.on('halfOpen', async () => {
            await this.logToFile('🟡 Circuit is half open.');
        });
        return breaker;
    }
    async logToFile(message) {
        const logDir = path.resolve('Logs');
        const logFile = path.join(logDir, `log-${new Date().toISOString().split('T')[0]}.txt`);
        try {
            await fs.promises.mkdir(logDir, { recursive: true });
            await fs.promises.appendFile(logFile, `${new Date().toISOString()} - ${message}\n`);
        }
        catch (error) {
            console.error('🚫 Failed to write circuit breaker log:', error);
        }
    }
};
exports.CircuitBreakerHandler = CircuitBreakerHandler;
exports.CircuitBreakerHandler = CircuitBreakerHandler = __decorate([
    (0, common_1.Injectable)()
], CircuitBreakerHandler);
//# sourceMappingURL=circuit-breaker.handler.js.map